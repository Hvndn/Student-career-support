package com.fivecore.jobportal.controller.student;

import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.service.interaction.PdfExportService;
import com.fivecore.jobportal.service.student.RecommendationService;
import com.fivecore.jobportal.service.student.JobSearchService;
import com.fivecore.jobportal.dto.JobResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.Authentication;

import java.io.IOException;

/**
 * Bộ điều khiển Tính năng Nâng cao (Sprint 5).
 * Quản lý US-012, US-020.
 */
@Controller
@RequestMapping("/student/advanced")
@RequiredArgsConstructor
public class StudentAdvanceController {

    private final PdfExportService pdfExportService;
    private final RecommendationService recommendationService;
    private final JobSearchService jobSearchService;
    private final com.fivecore.jobportal.repository.UserRepository userRepository;

    private Integer getCurrentStudentId(Authentication authentication) {
        if (authentication == null) return 1;
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getStudent() != null ? u.getStudent().getId() : 1)
                .orElse(1);
    }

    /**
     * Xuất hồ sơ PDF (US-012).
     */
    @GetMapping("/export-pdf")
    public void exportToPdf(HttpServletResponse response, Authentication authentication) throws IOException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=portfolio.pdf");

        Integer studentId = getCurrentStudentId(authentication);
        pdfExportService.exportProfileToPdf(studentId, response);
    }

    /**
     * Chức năng tìm kiếm việc làm (US-006).
     */
    @GetMapping("/jobs/search")
    public String searchJobs(@RequestParam(required = false) String keyword,
                             @RequestParam(required = false) String location,
                             @RequestParam(required = false) String skill,
                             @RequestParam(required = false) String jobType,
                             Model model) {
        java.util.List<JobResponse> jobs = jobSearchService.searchJobs(keyword, location, skill, jobType);
        model.addAttribute("jobs", jobs);
        if (jobs.isEmpty()) {
            model.addAttribute("message", "Không tìm thấy kết quả");
        }
        return "student/jobs";
    }

    /**
     * Xem gợi ý việc làm phù hợp (US-020).
     */
    @GetMapping("/recommendations")
    public String viewRecommendations(Model model, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        model.addAttribute("suggestedJobs", recommendationService.recommendJobs(studentId));
        return "student/recommendations";
    }
}
