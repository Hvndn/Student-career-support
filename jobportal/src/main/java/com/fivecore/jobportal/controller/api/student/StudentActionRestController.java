package com.fivecore.jobportal.controller.api.student;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.auth.ApplicationService;
import com.fivecore.jobportal.service.interaction.NotificationService;
import com.fivecore.jobportal.service.student.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST API Controller cho các hành động của Sinh viên (Ứng tuyển, Lưu việc,
 * Thông báo).
 */
@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentActionRestController {

    private final ApplicationService applicationService;
    private final NotificationService notificationService;
    private final SavedJobService savedJobService;
    private final UserRepository userRepository;

    private Integer getCurrentStudentId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getStudent() != null ? u.getStudent().getId() : null)
                .orElse(null);
    }

    private Integer getCurrentUserId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getId())
                .orElse(null);
    }

    /**
     * API Ứng tuyển công việc.
     */
    @PostMapping("/jobs/{jobId}/apply")
    public ResponseEntity<ApiResponse<Object>> applyJob(@PathVariable("jobId") Integer jobId,
            Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        if (studentId == null)
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        try {
            applicationService.applyForJob(studentId, jobId);
            return ResponseEntity.ok(ApiResponse.success("Ứng tuyển thành công", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "APPLY_ERROR"));
        }
    }

    /**
     * API Hủy ứng tuyển công việc.
     */
    @DeleteMapping("/jobs/{jobId}/apply")
    public ResponseEntity<ApiResponse<Object>> cancelApply(@PathVariable("jobId") Integer jobId,
            Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        if (studentId == null)
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        try {
            applicationService.cancelApplication(studentId, jobId);
            return ResponseEntity.ok(ApiResponse.success("Hủy ứng tuyển thành công", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "CANCEL_ERROR"));
        }
    }

    /**
     * API Lưu tin tuyển dụng.
     */
    @PostMapping("/jobs/{jobId}/save")
    public ResponseEntity<ApiResponse<Object>> saveJob(@PathVariable Integer jobId, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        if (studentId == null)
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        try {
            savedJobService.saveJob(studentId, jobId);
            return ResponseEntity.ok(ApiResponse.success("Đã lưu tin tuyển dụng", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "SAVE_ERROR"));
        }
    }

    /**
     * API Lấy danh sách việc làm đã lưu.
     */
    @GetMapping("/jobs/saved")
    public ResponseEntity<ApiResponse<Object>> getSavedJobs(Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        return ResponseEntity
                .ok(ApiResponse.success("Lấy danh sách đã lưu thành công", savedJobService.getSavedJobs(studentId)));
    }

    /**
     * API Lấy danh sách ứng tuyển của tôi.
     */
    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<Object>> getMyApplications(Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách ứng tuyển thành công",
                applicationService.getApplicationsByStudent(studentId)));
    }

    /**
     * API Lấy danh sách thông báo.
     */
    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<Object>> getNotifications(Authentication authentication) {
        Integer userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy thông báo thành công", notificationService.getNotificationsByUser(userId)));
    }
}
