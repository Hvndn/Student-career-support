package com.fivecore.jobportal.controller.api.company;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.entity.Application;
import com.fivecore.jobportal.service.auth.ApplicationService;
import com.fivecore.jobportal.service.company.CandidateSearchService;
import com.fivecore.jobportal.service.company.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    private final InterviewService interviewService;

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
            @RequestParam("status") String status) {
        try {
            applicationService.updateApplicationStatus(appId,
                    Application.ApplicationStatus.valueOf(status.toUpperCase()));
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Trạng thái không hợp lệ", "INVALID_STATUS"));
        }
    }

    /**
     * API Tìm kiếm ứng viên theo kỹ năng.
     */
    @GetMapping("/candidates/search")
    public ResponseEntity<ApiResponse<Object>> searchCandidates(
            @RequestParam(value = "skill", required = false) String skill) {
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm ứng viên thành công",
                candidateSearchService.searchStudentsBySkill(skill)));
    }

    /**
     * API Đặt lịch phỏng vấn.
     */
    @PostMapping("/applications/{appId}/schedule")
    public ResponseEntity<ApiResponse<Object>> scheduleInterview(@PathVariable Integer appId,
            @RequestParam("time") String timeStr,
            @RequestParam("location") String location) {
        // Giả định logic đặt lịch (trong thực tế cần parse timeStr)
        Application appEntity = applicationService.getApplicationEntity(appId);
        if (appEntity == null)
            return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy hồ sơ ứng tuyển", "NOT_FOUND"));

        interviewService.scheduleInterview(appEntity, LocalDateTime.now().plusDays(1), location);
        return ResponseEntity.ok(ApiResponse.success("Đặt lịch phỏng vấn thành công", null));
    }
}
