package com.fivecore.jobportal.controller.api.student;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.dto.InterviewResponse;
import com.fivecore.jobportal.entity.Application;
import com.fivecore.jobportal.entity.Interview;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.auth.ApplicationService;
import com.fivecore.jobportal.service.interaction.NotificationService;
import com.fivecore.jobportal.service.company.InterviewService;
import com.fivecore.jobportal.service.student.RecommendationService;
import com.fivecore.jobportal.service.student.SavedJobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class StudentActionRestController {

    private final ApplicationService applicationService;
    private final NotificationService notificationService;
    private final SavedJobService savedJobService;
    private final RecommendationService recommendationService;
    private final InterviewService interviewService;
    private final UserRepository userRepository;
    private final com.fivecore.jobportal.service.common.StorageService storageService;

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
     * API Ứng tuyển công việc (Premium with CV and Cover Letter).
     */
    @PostMapping("/jobs/{jobId}/apply")
    public ResponseEntity<ApiResponse<Object>> applyJob(@PathVariable("jobId") Integer jobId,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "coverLetter", required = false) String coverLetter,
            @RequestParam(value = "cvFile", required = false) org.springframework.web.multipart.MultipartFile cvFile,
            @RequestParam(value = "coverLetterFile", required = false) org.springframework.web.multipart.MultipartFile coverLetterFile,
            @RequestParam(value = "cvData", required = false) String cvData,
            @RequestParam(value = "cvName", required = false) String cvName,
            Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        if (studentId == null)
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        try {
            log.info("Ứng tuyển Job ID: {}, cvData length: {}, hasFile: {}, cvName: {}", jobId, 
                cvData != null ? cvData.length() : "null", 
                cvFile != null && !cvFile.isEmpty(),
                cvName);
            
            String cvUrl = null;
            if (cvFile != null && !cvFile.isEmpty()) {
                cvUrl = storageService.saveFile(cvFile, "cvs");
            }

            String clUrl = coverLetter; // Default to text if provided
            if (coverLetterFile != null && !coverLetterFile.isEmpty()) {
                clUrl = storageService.saveFile(coverLetterFile, "cover_letters");
            }

            applicationService.applyForJob(studentId, jobId, fullName, email, phone, clUrl, cvUrl, cvData, cvName);
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

    /**
     * API Lấy danh sách việc làm gợi ý.
     */
    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<Object>> getRecommendations(Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách gợi ý thành công",
                recommendationService.recommendJobs(studentId)));
    }

    /**
     * API Lấy danh mục lịch phỏng vấn của sinh viên.
     */
    @GetMapping("/interviews")
    public ResponseEntity<ApiResponse<Object>> getInterviews(Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        if (studentId == null)
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        java.util.List<Interview> interviews = interviewService.getInterviewsByStudent(studentId);
        
        java.util.List<InterviewResponse> response = interviews.stream().map(i -> {
            Application app = i.getApplication();
            return InterviewResponse.builder()
                .id(i.getId())
                .interviewDate(i.getInterviewDate())
                .location(i.getLocation())
                .notes(i.getNotes())
                .interviewerInfo(i.getInterviewerInfo())
                .requiredDocuments(i.getRequiredDocuments())
                .interviewFormat(i.getInterviewFormat())
                .preliminaryContent(i.getPreliminaryContent())
                .status(i.getStatus())
                .result(i.getResult())
                .applicationId(app.getId())
                .studentId(studentId)
                .studentName(app.getStudent() != null && app.getStudent().getUser() != null ? app.getStudent().getUser().getFullName() : app.getFullName())
                .studentEmail(app.getStudent() != null && app.getStudent().getUser() != null ? app.getStudent().getUser().getEmail() : app.getEmail())
                .studentAvatar(app.getStudent() != null ? app.getStudent().getAvatarUrl() : null)
                .jobTitle(app.getJob() != null ? app.getJob().getTitle() : "N/A")
                .companyName(app.getJob() != null && app.getJob().getCompany() != null ? app.getJob().getCompany().getName() : "Công ty ẩn danh")
                .companyLogo(app.getJob() != null && app.getJob().getCompany() != null ? app.getJob().getCompany().getLogoUrl() : null)
                .companyEmail(app.getJob() != null && app.getJob().getCompany() != null ? app.getJob().getCompany().getEmail() : null)
                .build();
        }).collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Lấy lịch phỏng vấn thành công", response));
    }

    /**
     * API Xác nhận tham gia phỏng vấn.
     */
    @PostMapping("/interviews/{id}/confirm")
    public ResponseEntity<ApiResponse<Object>> confirmInterview(@PathVariable Integer id, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        if (studentId == null)
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        try {
            interviewService.confirmInterview(id, studentId);
            return ResponseEntity.ok(ApiResponse.success("Đã xác nhận tham gia phỏng vấn", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "CONFIRM_ERROR"));
        }
    }

    /**
     * API Đánh dấu thông báo đã đọc.
     */
    @PatchMapping("/notifications/{id}/read")
    public ResponseEntity<ApiResponse<Object>> markNotificationAsRead(@PathVariable Integer id, Authentication authentication) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Đã đánh dấu đã đọc", null));
    }
}
