package com.fivecore.jobportal.controller.api.admin;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.service.admin.AdminService;
import com.fivecore.jobportal.service.auth.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


/**
 * REST API Controller cho Quản trị viên.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminRestController {

    private final SkillService skillService;
    private final AdminService adminService;

    /**
     * API Thống kê hệ thống.
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStatistics() {
        return ResponseEntity.ok(ApiResponse.success("Lấy thống kê thành công", adminService.getSystemStatistics()));
    }

    /**
     * API Lấy danh sách toàn bộ người dùng.
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<java.util.List<com.fivecore.jobportal.entity.User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách người dùng thành công", adminService.getAllUsers()));
    }

    /**
     * API Lấy toàn bộ kỹ năng.
     */
    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<java.util.List<com.fivecore.jobportal.entity.Skill>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách kỹ năng thành công", skillService.getAllSkills()));
    }

    /**
     * API Phê duyệt doanh nghiệp.
     */
    @PostMapping("/companies/{id}/approve")
    public ResponseEntity<ApiResponse<Object>> approveCompany(@PathVariable Integer id) {
        adminService.toggleUserLock(id, false);
        return ResponseEntity.ok(ApiResponse.success("Phê duyệt doanh nghiệp thành công", null));
    }

    /**
     * API Thêm kỹ năng mới.
     */
    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<Object>> createSkill(@RequestParam("name") String name, 
                                                           @RequestParam(value = "category", defaultValue = "General") String category) {
        skillService.createNewSkill(name, category);
        return ResponseEntity.ok(ApiResponse.success("Thêm kỹ năng thành công", null));
    }

    /**
     * API Xóa kỹ năng.
     */
    @DeleteMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteSkill(@PathVariable Integer id) {
        skillService.deleteSkill(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa kỹ năng thành công", null));
    }

    /**
     * API Khóa hoặc Mở khóa người dùng (Toggle).
     */
    @PostMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Object>> toggleUserStatus(@PathVariable Integer id) {
        // Lấy user hiện tại để biết trạng thái lock/unlock
        com.fivecore.jobportal.entity.User user = adminService.getAllUsers().stream()
                .filter(u -> u.getId().equals(id))
                .findFirst().orElse(null);
        
        if (user != null) {
            boolean currentLocked = !user.isActive();
            adminService.toggleUserLock(id, !currentLocked);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", null));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy người dùng", "NOT_FOUND"));
    }
}

