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

        interviewService.scheduleInterview(appEntity, request.getInterviewDate(), request.getLocation());
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
                .status(i.getStatus())
                .result(i.getResult())
                .applicationId(app.getId())
                .studentId(app.getStudent() != null ? app.getStudent().getId() : null)
                .studentName(app.getStudent() != null && app.getStudent().getUser() != null ? app.getStudent().getUser().getFullName() : app.getFullName())
                .studentEmail(app.getStudent() != null && app.getStudent().getUser() != null ? app.getStudent().getUser().getEmail() : app.getEmail())
                .studentAvatar(app.getStudent() != null ? app.getStudent().getAvatarUrl() : null)
                .jobTitle(app.getJob() != null ? app.getJob().getTitle() : "N/A")
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
}
