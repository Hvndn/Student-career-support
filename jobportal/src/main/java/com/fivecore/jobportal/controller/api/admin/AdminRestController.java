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
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatistics() {
        return ResponseEntity.ok(ApiResponse.success("Lấy thống kê thành công", adminService.getSystemStatistics()));
    }

    /**
     * API Lấy danh sách toàn bộ người dùng.
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<com.fivecore.jobportal.entity.User>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return ResponseEntity
                .ok(ApiResponse.success("Lấy danh sách người dùng thành công", adminService.getAllUsers(pageable)));
    }

    /**
     * API Lấy chi tiết thông tin người dùng và hồ sơ.
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<com.fivecore.jobportal.dto.UserDetailResponse>> getUserDetail(
            @PathVariable Integer id) {
        return ResponseEntity
                .ok(ApiResponse.success("Lấy chi tiết người dùng thành công", adminService.getUserDetail(id)));
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
     * API Cập nhật kỹ năng/ngành nghề.
     */
    @PutMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Object>> updateSkill(@PathVariable Integer id, @RequestParam("name") String name,
            @RequestParam(value = "category", defaultValue = "General") String category) {
        skillService.updateSkill(id, name, category);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", null));
    }

    @PostMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Object>> toggleUserStatus(@PathVariable Integer id) {
        return adminService.getAllUsers(org.springframework.data.domain.PageRequest.of(0, 1000)).stream()
                .filter(u -> u.getId().equals(id))
                .findFirst()
                .map(user -> {
                    boolean currentLocked = !user.isActive();
                    adminService.toggleUserLock(id, !currentLocked);
                    return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", null));
                })
                .orElse(ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy người dùng", "NOT_FOUND")));
    }

    /**
     * API Cập nhật vai trò người dùng.
     */
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<Object>> updateUserRole(@PathVariable Integer id,
            @RequestParam("role") String role) {
        try {
            com.fivecore.jobportal.entity.User.Role newRole = com.fivecore.jobportal.entity.User.Role
                    .valueOf(role.toLowerCase());
            adminService.updateUserRole(id, newRole);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật vai trò thành công", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vai trò không hợp lệ", "INVALID_ROLE"));
        }
    }

    /**
     * API Xóa người dùng (Dùng cho flow không JS - Redirect về frontend).
     */
    @PostMapping("/users/{id}/delete")
    public ResponseEntity<Object> deleteUser(@PathVariable Integer id) {
        adminService.deleteUser(id);
        // Redirect về trang quản lý người dùng ở frontend
        return ResponseEntity.status(302)
                .header("Location", "http://localhost:5174/admin/users")
                .build();
    }
}
