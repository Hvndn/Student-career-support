package com.fivecore.jobportal.controller.api.company;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.dto.InterviewResponse;
import com.fivecore.jobportal.entity.Application;
import com.fivecore.jobportal.entity.Interview;
import com.fivecore.jobportal.service.auth.ApplicationService;
import com.fivecore.jobportal.service.company.CandidateMatchingService;
import com.fivecore.jobportal.service.company.CandidateSearchService;
import com.fivecore.jobportal.service.company.InterviewService;
import com.fivecore.jobportal.repository.InterviewRepository;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.interaction.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * REST API Controller cho Quản lý Tuyển dụng của Doanh nghiệp.
 */
@RestController
@RequestMapping("/api/company/management")
@RequiredArgsConstructor
public class RecruitmentRestController {

    private final ApplicationService applicationService;
    private final CandidateSearchService candidateSearchService;
    private final CandidateMatchingService candidateMatchingService;
    private final InterviewService interviewService;
    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /**
     * API Gợi ý ứng viên phù hợp cho một công việc.
     */
    @GetMapping("/jobs/{jobId}/recommendations")
    public ResponseEntity<ApiResponse<Object>> getRecommendedCandidates(@PathVariable Integer jobId, Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        if (companyId == null) return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));
        
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách ứng viên gợi ý thành công", 
                candidateMatchingService.getRecommendedCandidates(jobId)));
    }

    private Integer getCurrentCompanyId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getCompany() != null ? u.getCompany().getId() : null)
                .orElse(null);
    }

    /**
     * API Xem toàn bộ danh sách hồ sơ ứng tuyển của doanh nghiệp (US-018 mở rộng).
     */
    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<Object>> getApplications(Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        if (companyId == null) return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách ứng tuyển thành công", 
                applicationService.getApplicationsByCompany(companyId)));
    }

    /**
     * API Xem chi tiết hồ sơ ứng tuyển (Snapshot).
     */
    @GetMapping("/applications/{appId}")
    public ResponseEntity<ApiResponse<Object>> getApplicationDetail(@PathVariable Integer appId, Authentication authentication) {
        Application application = applicationService.getApplicationEntity(appId);
        if (application == null) {
            return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy hồ sơ", "NOT_FOUND"));
        }

        // Kiểm tra quyền: Công ty sở hữu Job hoặc Sinh viên sở hữu Application
        Integer companyId = getCurrentCompanyId(authentication);
        boolean isOwnerCompany = companyId != null && application.getJob().getCompany().getId().equals(companyId);
        
        boolean isOwnerStudent = false;
        com.fivecore.jobportal.entity.User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user != null && user.getStudent() != null && application.getStudent().getId().equals(user.getStudent().getId())) {
            isOwnerStudent = true;
        }

        if (!isOwnerCompany && !isOwnerStudent) {
            return ResponseEntity.status(403).body(ApiResponse.error("Bạn không có quyền xem hồ sơ này", "FORBIDDEN"));
        }

        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết hồ sơ thành công", applicationService.getApplicationDtoById(appId)));
    }

    /**
     * API Xem danh sách ứng viên cho một tin tuyển dụng.
     */
    @GetMapping("/jobs/{jobId}/applicants")
    public ResponseEntity<ApiResponse<Object>> getApplicants(@PathVariable Integer jobId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách ứng viên thành công",
                applicationService.getApplicantsByJob(jobId)));
    }

    /**
     * API Cập nhật trạng thái ứng viên.
     */
    @PatchMapping("/applications/{appId}/status")
    public ResponseEntity<ApiResponse<Object>> updateStatus(@PathVariable Integer appId,
            @RequestParam("status") String status,
            Authentication authentication) {
        try {
            Integer companyId = getCurrentCompanyId(authentication);
            if (companyId == null) {
                return ResponseEntity.status(403).body(ApiResponse.error("Bạn không có quyền thực hiện hành động này!", "FORBIDDEN"));
            }

            applicationService.updateApplicationStatus(appId,
                    Enum.valueOf(Application.ApplicationStatus.class, status.trim().toLowerCase()),
                    companyId);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Trạng thái không hợp lệ", "INVALID_STATUS"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage(), "FORBIDDEN"));
        }
    }

    /**
     * API Tìm kiếm ứng viên với bộ lọc đa dạng (US-014 mở rộng).
     */
    @GetMapping("/candidates/search")
    public ResponseEntity<ApiResponse<Object>> searchCandidates(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "skill", required = false) String skill) {
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm ứng viên thành công", 
                candidateSearchService.searchStudents(query, skill)));
    }

    @PostMapping("/applications/schedule")
    public ResponseEntity<ApiResponse<Object>> scheduleInterview(@RequestBody com.fivecore.jobportal.dto.InterviewRequest request,
            Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        if (companyId == null) return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        Application appEntity = applicationService.getApplicationEntity(request.getApplicationId());
        if (appEntity == null)
            return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy hồ sơ ứng tuyển", "NOT_FOUND"));

        // Kiểm tra quyền sở hữu: Job của đơn ứng tuyển phải thuộc về công ty
        if (!appEntity.getJob().getCompany().getId().equals(companyId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Bạn không có quyền đặt lịch cho ứng viên này!", "FORBIDDEN"));
        }

        interviewService.scheduleInterview(appEntity, request);
        return ResponseEntity.ok(ApiResponse.success("Đặt lịch phỏng vấn thành công", null));
    }

    @GetMapping("/interviews")
    public ResponseEntity<ApiResponse<Object>> getInterviews(Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        if (companyId == null)
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        java.util.List<Interview> interviews = interviewService.getInterviewsByCompany(companyId);
        
        java.util.List<InterviewResponse> response = interviews.stream().map(i -> {
            Application app = i.getApplication();
            return InterviewResponse.builder()
                .id(i.getId())
                .interviewDate(i.getInterviewDate())
                .location(i.getLocation())
                .notes(i.getNotes())
                .interviewerInfo(i.getInterviewerInfo())
                .interviewerEmail(i.getInterviewerEmail())
                .interviewerPhone(i.getInterviewerPhone())
                .requiredDocuments(i.getRequiredDocuments())
                .interviewFormat(i.getInterviewFormat())
                .preliminaryContent(i.getPreliminaryContent())
                .duration(i.getDuration())
                .meetingLink(i.getMeetingLink())
                .round(i.getRound())
                .technicalScore(i.getTechnicalScore())
                .communicationScore(i.getCommunicationScore())
                .problemSolvingScore(i.getProblemSolvingScore())
                .evaluationNotes(i.getEvaluationNotes())
                .overallScore(i.getOverallScore())
                .stageType(i.getStageType())
                .recommendation(i.getRecommendation())
                .status(i.getStatus())
                .result(i.getResult())
                .applicationId(app.getId())
                .studentId(app.getStudent() != null ? app.getStudent().getId() : null)
                .studentName(app.getStudent() != null && app.getStudent().getUser() != null ? app.getStudent().getUser().getFullName() : app.getFullName())
                .studentEmail(app.getStudent() != null && app.getStudent().getUser() != null ? app.getStudent().getUser().getEmail() : app.getEmail())
                .studentAvatar(app.getStudent() != null ? app.getStudent().getAvatarUrl() : null)
                .jobTitle(app.getJob() != null ? app.getJob().getTitle() : "N/A")
                .companyName(app.getJob() != null && app.getJob().getCompany() != null ? app.getJob().getCompany().getName() : "N/A")
                .companyLogo(app.getJob() != null && app.getJob().getCompany() != null ? app.getJob().getCompany().getLogoUrl() : null)
                .companyEmail(app.getJob() != null && app.getJob().getCompany() != null ? app.getJob().getCompany().getEmail() : "N/A")
                .build();
        }).collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lịch phỏng vấn thành công", response));
    }

    /**
     * API Hủy lịch phỏng vấn.
     */
    @DeleteMapping("/interviews/{id}")
    public ResponseEntity<ApiResponse<Object>> cancelInterview(@PathVariable Integer id, Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        if (companyId == null)
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        // Kiểm tra quyền sở hữu
        Interview interview = interviewRepository.findById(id).orElse(null);
        if (interview == null || !interview.getApplication().getJob().getCompany().getId().equals(companyId)) {
            return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy lịch phỏng vấn hoặc không có quyền", "NOT_FOUND"));
        }

        interviewService.cancelInterview(id);
        return ResponseEntity.ok(ApiResponse.success("Đã hủy lịch phỏng vấn thành công", null));
    }

    /**
     * API Cập nhật lịch phỏng vấn.
     */
    @PutMapping("/interviews/{id}")
    public ResponseEntity<ApiResponse<Object>> updateInterview(@PathVariable Integer id, 
            @RequestBody com.fivecore.jobportal.dto.InterviewRequest request,
            Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        if (companyId == null)
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        // Kiểm tra quyền sở hữu
        Interview interview = interviewRepository.findById(id).orElse(null);
        if (interview == null || !interview.getApplication().getJob().getCompany().getId().equals(companyId)) {
            return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy lịch phỏng vấn hoặc không có quyền", "NOT_FOUND"));
        }

        interviewService.updateInterview(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lịch phỏng vấn thành công", null));
    }

    /**
     * API Cập nhật trạng thái phỏng vấn (Vòng đời: upcoming, in_progress, no_show...).
     */
    @PatchMapping("/interviews/{id}/status")
    public ResponseEntity<ApiResponse<Object>> updateInterviewStatus(@PathVariable Integer id,
            @RequestParam("status") String status,
            Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        if (companyId == null) return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        Interview interview = interviewRepository.findById(id).orElse(null);
        if (interview == null || !interview.getApplication().getJob().getCompany().getId().equals(companyId)) {
            return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy lịch phỏng vấn", "NOT_FOUND"));
        }

        interviewService.updateInterviewStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", null));
    }

    /**
     * API Đánh giá buổi phỏng vấn và cập nhật kết quả tuyển dụng.
     */
    @PostMapping("/interviews/{id}/evaluate")
    public ResponseEntity<ApiResponse<Object>> evaluateInterview(@PathVariable Integer id,
            @RequestBody com.fivecore.jobportal.dto.InterviewEvaluationRequest request,
            Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        if (companyId == null) return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        Interview interview = interviewRepository.findById(id).orElse(null);
        if (interview == null || !interview.getApplication().getJob().getCompany().getId().equals(companyId)) {
            return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy lịch phỏng vấn", "NOT_FOUND"));
        }

        interviewService.submitEvaluation(id, request);
        return ResponseEntity.ok(ApiResponse.success("Đã ghi nhận đánh giá phỏng vấn", null));
    }

    /**
     * API Lấy chi tiết lịch phỏng vấn.
     */
    @GetMapping("/interviews/{id}")
    public ResponseEntity<ApiResponse<Object>> getInterview(@PathVariable Integer id, Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        if (companyId == null)
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        Interview interview = interviewService.getInterview(id);
        if (!interview.getApplication().getJob().getCompany().getId().equals(companyId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Bạn không có quyền xem lịch phỏng vấn này", "FORBIDDEN"));
        }

        Application app = interview.getApplication();
        InterviewResponse response = InterviewResponse.builder()
            .id(interview.getId())
            .interviewDate(interview.getInterviewDate())
            .location(interview.getLocation())
            .notes(interview.getNotes())
            .interviewerInfo(interview.getInterviewerInfo())
            .interviewerEmail(interview.getInterviewerEmail())
            .interviewerPhone(interview.getInterviewerPhone())
            .requiredDocuments(interview.getRequiredDocuments())
            .interviewFormat(interview.getInterviewFormat())
            .preliminaryContent(interview.getPreliminaryContent())
            .duration(interview.getDuration())
            .meetingLink(interview.getMeetingLink())
            .round(interview.getRound())
            .technicalScore(interview.getTechnicalScore())
            .communicationScore(interview.getCommunicationScore())
            .problemSolvingScore(interview.getProblemSolvingScore())
            .evaluationNotes(interview.getEvaluationNotes())
            .overallScore(interview.getOverallScore())
            .stageType(interview.getStageType())
            .recommendation(interview.getRecommendation())
            .status(interview.getStatus())
            .result(interview.getResult())
            .applicationId(app.getId())
            .studentId(app.getStudent() != null ? app.getStudent().getId() : null)
            .studentName(app.getStudent() != null && app.getStudent().getUser() != null ? app.getStudent().getUser().getFullName() : app.getFullName())
            .studentEmail(app.getStudent() != null && app.getStudent().getUser() != null ? app.getStudent().getUser().getEmail() : app.getEmail())
            .studentAvatar(app.getStudent() != null ? app.getStudent().getAvatarUrl() : null)
            .jobTitle(app.getJob() != null ? app.getJob().getTitle() : "N/A")
            .companyName(app.getJob() != null && app.getJob().getCompany() != null ? app.getJob().getCompany().getName() : "N/A")
            .companyLogo(app.getJob() != null && app.getJob().getCompany() != null ? app.getJob().getCompany().getLogoUrl() : null)
            .companyEmail(app.getJob() != null && app.getJob().getCompany() != null ? app.getJob().getCompany().getEmail() : "N/A")
            .build();

        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết lịch phỏng vấn thành công", response));
    }

    /**
     * API Lấy chi tiết hồ sơ sinh viên.
     */
    @GetMapping("/candidates/{id}")
    public ResponseEntity<ApiResponse<Object>> getCandidateDetail(@PathVariable Integer id, Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        if (companyId == null)
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));

        try {
            java.util.Map<String, Object> detail = candidateSearchService.getCandidateDetail(id);
            return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết ứng tuyển thành công", detail));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage(), "NOT_FOUND"));
        }
    }

    /**
     * API Lấy danh sách thông báo.
     */
    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<Object>> getNotifications(Authentication authentication) {
        com.fivecore.jobportal.entity.User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null)
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));
            
        return ResponseEntity.ok(
                ApiResponse.success("Lấy thông báo thành công", notificationService.getNotificationsByUser(user.getId())));
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
