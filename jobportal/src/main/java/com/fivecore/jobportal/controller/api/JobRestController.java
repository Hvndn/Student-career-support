package com.fivecore.jobportal.controller.api;

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
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobs(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "skill", required = false) String skill,
            @RequestParam(value = "jobType", required = false) String jobType) {
        
        List<JobResponse> jobs = jobSearchService.searchJobs(keyword, location, skill, jobType);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách công việc thành công", jobs));
    }

    /**
     * API Chi tiết công việc.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable("id") Integer id) {
        JobResponse job = jobSearchService.getJobById(id);
        if (job == null) {
            return ResponseEntity.status(404)
                    .body(ApiResponse.error("Không tìm thấy công việc", "NOT_FOUND"));
        }
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết công việc thành công", job));
    }
}
