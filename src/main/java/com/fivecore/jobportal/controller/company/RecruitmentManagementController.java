package com.fivecore.jobportal.controller.company;

import com.fivecore.jobportal.dto.ApplicationDto;
import com.fivecore.jobportal.entity.Application;
import com.fivecore.jobportal.service.auth.ApplicationService;
import com.fivecore.jobportal.service.company.CandidateSearchService;
import com.fivecore.jobportal.service.company.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * Bộ điều khiển Quản lý Tuyển dụng (Sprint 4).
 * Quản lý US-009, US-014, US-017, US-018.
 */
@Controller
@RequestMapping("/company/management")
@RequiredArgsConstructor
public class RecruitmentManagementController {

    private final ApplicationService applicationService;
    private final CandidateSearchService candidateSearchService;
    private final InterviewService interviewService;

    /**
     * Xem danh sách ứng viên cho một tin tuyển dụng (US-018).
     */
    @GetMapping("/jobs/{jobId}/applicants")
    public String viewApplicants(@PathVariable Integer jobId, Model model) {
        model.addAttribute("applicants", applicationService.getApplicantsByJob(jobId));
        return "company/applicants";
    }

    /**
     * Phê duyệt trạng thái ứng viên (US-009).
     */
    @PostMapping("/applications/{appId}/status")
    public String updateStatus(@PathVariable Integer appId, @RequestParam("status") String status) {
        applicationService.updateApplicationStatus(appId, Application.ApplicationStatus.valueOf(status));
        return "redirect:/company/management/applications/" + appId;
    }

    /**
     * Tìm kiếm ứng viên theo kỹ năng (US-014).
     */
    @GetMapping("/candidates/search")
    public String searchCandidates(@RequestParam(value = "skill", required = false) String skill, Model model) {
        model.addAttribute("candidates", candidateSearchService.searchStudents(null, skill));
        return "company/candidate-search";
    }

    /**
     * Đặt lịch phỏng vấn (US-017).
     */
    @PostMapping("/applications/{appId}/schedule")
    public String scheduleInterview(@PathVariable Integer appId, 
                                    @RequestParam("time") String timeStr,
                                    @RequestParam("location") String location) {
        // Tìm ApplicationDto từ service
        ApplicationDto app = applicationService.getApplicationsByStudent(1).stream()
                .filter(a -> a.getId().equals(appId)).findFirst().orElse(null);
        
        if (app != null) {
            // Lưu ý: interviewService vẫn nhận Application entity nên ta giả định map hoặc lấy từ repo trong thực tế
            // Ở đây vì mục đích refactor DTO Controller, ta giữ nguyên logic gọi Service
            Application appEntity = applicationService.getApplicationEntity(appId); 
            interviewService.scheduleInterview(appEntity, LocalDateTime.now().plusDays(1), location);
            return "redirect:/company/management/jobs/" + app.getJobId() + "/applicants";
        }
        return "redirect:/company/dashboard";
    }
}
