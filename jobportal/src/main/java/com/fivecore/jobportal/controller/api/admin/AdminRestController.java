package com.fivecore.jobportal.controller.api.admin;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.dto.admin.AdminCompanyUpdateRequest;
import com.fivecore.jobportal.dto.admin.AdminCreateRequest;
import com.fivecore.jobportal.dto.admin.AdminCompanyCreateRequest;
import com.fivecore.jobportal.dto.admin.AdminStudentCreateRequest;
import com.fivecore.jobportal.dto.admin.AdminInterviewResponse;
import com.fivecore.jobportal.dto.admin.AdminStudentUpdateRequest;
import com.fivecore.jobportal.entity.Category;
import com.fivecore.jobportal.entity.Skill;
import com.fivecore.jobportal.repository.CategoryRepository;
import com.fivecore.jobportal.repository.SkillRepository;
import com.fivecore.jobportal.service.admin.AdminService;
import com.fivecore.jobportal.service.auth.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

/**
 * REST API Controller cho Quản trị viên.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminRestController {

    private final SkillRepository skillRepository;
    private final CategoryRepository categoryRepository;
    private final AdminService adminService;
    private final PasswordResetService passwordResetService;

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
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String role) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        com.fivecore.jobportal.entity.User.Role userRole = null;
        if (role != null && !role.isEmpty() && !"all".equalsIgnoreCase(role)) {
            try {
                userRole = com.fivecore.jobportal.entity.User.Role.valueOf(role.toLowerCase());
            } catch (IllegalArgumentException e) {
                // Ignore invalid role
            }
        }
        return ResponseEntity
                .ok(ApiResponse.success("Lấy danh sách người dùng thành công", adminService.getAllUsers(pageable, userRole)));
    }

    /**
     * API Tạo mới sinh viên dành cho Admin.
     */
    @PostMapping("/create-student")
    public ResponseEntity<ApiResponse<Object>> createStudentFromAdmin(@RequestBody AdminStudentCreateRequest request) {
        try {
            adminService.createStudentFromAdmin(request);
            return ResponseEntity.ok(ApiResponse.success("Thêm sinh viên mới thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error("Lỗi khi thêm sinh viên: " + e.getMessage(), "CREATE_ERROR"));
        }
    }

    /**
     * API Tạo mới tài khoản quản trị dành cho Admin.
     */
    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse<Object>> createAdminFromAdmin(@RequestBody AdminCreateRequest request) {
        try {
            adminService.createAdminFromAdmin(request);
            return ResponseEntity.ok(ApiResponse.success("Thêm tài khoản quản trị mới thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error("Lỗi khi thêm tài khoản: " + e.getMessage(), "CREATE_ERROR"));
        }
    }

    /**
     * API Tạo mới doanh nghiệp dành cho Admin.
     */
    @PostMapping("/create-company")
    public ResponseEntity<ApiResponse<Object>> createCompanyFromAdmin(@RequestBody AdminCompanyCreateRequest request) {
        try {
            adminService.createCompanyFromAdmin(request);
            return ResponseEntity.ok(ApiResponse.success("Thêm doanh nghiệp mới thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error("Lỗi khi thêm doanh nghiệp: " + e.getMessage(), "CREATE_ERROR"));
        }
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
    public ResponseEntity<ApiResponse<java.util.List<Skill>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách kỹ năng thành công", skillRepository.findAll()));
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
        skillRepository.save(Skill.builder().name(name).category(category).build());
        return ResponseEntity.ok(ApiResponse.success("Thêm kỹ năng thành công", null));
    }

    /**
     * API Xóa kỹ năng.
     */
    @DeleteMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteSkill(@PathVariable Integer id) {
        skillRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa kỹ năng thành công", null));
    }

    /**
     * API Cập nhật kỹ năng/ngành nghề.
     */
    @PutMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Object>> updateSkill(@PathVariable Integer id, @RequestParam("name") String name,
            @RequestParam(value = "category", defaultValue = "General") String category) {
        skillRepository.findById(id).ifPresent(s -> { s.setName(name); s.setCategory(category); skillRepository.save(s); });
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", null));
    }

    @PostMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Object>> toggleUserStatus(@PathVariable Integer id) {
        return adminService.getAllUsers(org.springframework.data.domain.PageRequest.of(0, 1000), null).stream()
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
     * API Xóa vĩnh viễn người dùng khỏi Database.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteUser(@PathVariable Integer id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa người dùng thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi xóa người dùng: " + e.getMessage(), "DELETE_ERROR"));
        }
    }

    /**
     * API Lấy danh sách việc làm.
     */
    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<java.util.List<com.fivecore.jobportal.dto.admin.AdminJobResponse>>> getAllJobs() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách việc làm thành công", adminService.getAllJobs()));
    }

    /**
     * API Duyệt/Từ chối tin tuyển dụng.
     */
    @PostMapping("/jobs/{id}/status")
    public ResponseEntity<ApiResponse<Object>> reviewJobPost(@PathVariable Integer id, @RequestParam("status") String status) {
        adminService.reviewJobPost(id, status);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", null));
    }

    /**
     * API Lấy danh sách công ty chờ duyệt.
     */
    @GetMapping("/companies/pending")
    public ResponseEntity<ApiResponse<java.util.List<com.fivecore.jobportal.entity.Company>>> getPendingCompanies() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách chờ duyệt thành công", adminService.getPendingCompanies()));
    }

    /**
     * API Lấy danh sách báo cáo (Mock tạm thời để tránh lỗi Error 500).
     */
    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<java.util.List<Object>>> getReports() {
        return ResponseEntity.ok(ApiResponse.success("Lấy báo cáo thành công", java.util.Collections.emptyList()));
    }

    /**
     * API Lấy danh sách yêu cầu cấp lại mật khẩu.
     */
    @GetMapping("/password-requests")
    public ResponseEntity<ApiResponse<java.util.List<com.fivecore.jobportal.entity.PasswordResetRequest>>> getPasswordRequests() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách yêu cầu thành công", passwordResetService.getAllPendingRequests()));
    }

    /**
     * API Lấy thống kê yêu cầu cấp lại mật khẩu.
     */
    @GetMapping("/password-requests/stats")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getPasswordRequestStats() {
        return ResponseEntity.ok(ApiResponse.success("Lấy thống kê thành công", passwordResetService.getRequestStats()));
    }

    /**
     * API Phê duyệt cấp lại mật khẩu.
     */
    @PostMapping("/password-requests/{id}/approve")
    public ResponseEntity<ApiResponse<Object>> approvePasswordRequest(@PathVariable Integer id) {
        try {
            String newPassword = passwordResetService.approveRequest(id);
            if (newPassword != null) {
                return ResponseEntity.ok(ApiResponse.success("Đã cấp lại mật khẩu thành công. Mật khẩu mới là: " + newPassword, null));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("Yêu cầu không tồn tại hoặc đã được xử lý", "APPROVE_FAILED"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi hệ thống: " + e.getMessage(), "SYSTEM_ERROR"));
        }
    }

    /**
     * API Lấy danh sách lịch hẹn.
     */
    @GetMapping("/interviews")
    public ResponseEntity<ApiResponse<java.util.List<AdminInterviewResponse>>> getAllInterviews() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lịch hẹn thành công", adminService.getAllInterviews()));
    }

    /**
     * API Cập nhật thông tin sinh viên dành cho Admin.
     */
    @PutMapping("/users/{id}/student")
    public ResponseEntity<ApiResponse<Object>> updateStudentFromAdmin(@PathVariable Integer id, @RequestBody AdminStudentUpdateRequest request) {
        try {
            adminService.updateStudentFromAdmin(id, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin sinh viên thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi cập nhật: " + e.getMessage(), "UPDATE_ERROR"));
        }
    }

    /**
     * API Cập nhật thông tin doanh nghiệp dành cho Admin.
     */
    @PutMapping("/users/{id}/company")
    public ResponseEntity<ApiResponse<Object>> updateCompanyFromAdmin(@PathVariable Integer id, @RequestBody AdminCompanyUpdateRequest request) {
        try {
            adminService.updateCompanyFromAdmin(id, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin doanh nghiệp thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi cập nhật: " + e.getMessage(), "UPDATE_ERROR"));
        }
    }

    /**
     * API Quản lý Danh mục (Categories)
     */
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách danh mục thành công", categoryRepository.findAll()));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(ApiResponse.success("Thêm danh mục thành công", categoryRepository.save(category)));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable Integer id, @RequestBody Category category) {
        return categoryRepository.findById(id)
                .map(existing -> {
                    existing.setName(category.getName());
                    existing.setSlug(category.getSlug());
                    existing.setDescription(category.getDescription());
                    existing.setIcon(category.getIcon());
                    existing.setStatus(category.getStatus());
                    return ResponseEntity.ok(ApiResponse.success("Cập nhật danh mục thành công", categoryRepository.save(existing)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteCategory(@PathVariable Integer id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa danh mục thành công", null));
    }

    /**
     * API Cập nhật tài khoản quản trị.
     */
    @PutMapping("/users/{id}/admin")
    public ResponseEntity<ApiResponse<Object>> updateAdminFromAdmin(@PathVariable Integer id, @RequestBody AdminCreateRequest request) {
        try {
            adminService.updateAdmin(id, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật quản trị viên thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi cập nhật: " + e.getMessage(), "UPDATE_ERROR"));
        }
    }

    @DeleteMapping("/interviews/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteInterview(@PathVariable Integer id) {
        try {
            adminService.deleteInterview(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa lịch hẹn thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi xóa lịch hẹn: " + e.getMessage(), "DELETE_ERROR"));
        }
    }
}
