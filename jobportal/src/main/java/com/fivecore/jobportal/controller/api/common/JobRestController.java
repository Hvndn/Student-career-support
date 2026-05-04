package com.fivecore.jobportal.controller.api.common;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.service.student.JobSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API Controller cho Công việc.
 * Sử dụng cấu trúc phản hồi chuẩn ApiResponse.
 */
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobRestController {

    private final JobSearchService jobSearchService;

    /**
     * API Tìm kiếm công việc.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponse>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) java.math.BigDecimal minSalary,
            @RequestParam(required = false) java.math.BigDecimal maxSalary,
            @RequestParam(required = false) Boolean negotiable,
            org.springframework.security.core.Authentication authentication) {

        Integer studentId = null;
        if (authentication != null && authentication.isAuthenticated() 
            && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            studentId = jobSearchService.getStudentIdByEmail(authentication.getName());
        }

        List<JobResponse> jobs = jobSearchService.searchJobs(keyword, location, industry, jobType, minSalary, maxSalary, negotiable, studentId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách công việc thành công", jobs));
    }

    /**
     * API Chi tiết công việc.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable("id") Integer id,
            org.springframework.security.core.Authentication authentication) {
        Integer studentId = null;
        if (authentication != null && authentication.isAuthenticated()) {
            // Lấy studentId nếu là sinh viên
            studentId = jobSearchService.getStudentIdByEmail(authentication.getName());
        }

        JobResponse job = jobSearchService.getJobById(id, studentId);
        if (job == null) {
            return ResponseEntity.status(404)
                    .body(ApiResponse.error("Không tìm thấy công việc", "NOT_FOUND"));
        }
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết công việc thành công", job));
    }
}
