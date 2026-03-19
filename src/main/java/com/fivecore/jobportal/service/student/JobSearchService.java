package com.fivecore.jobportal.service.student;

import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Dịch vụ Tìm kiếm Việc làm (US-006).
 * Sử dụng JPA Specifications để lọc đa điều kiện.
 */
@Service
@RequiredArgsConstructor
public class JobSearchService {

    private final JobRepository jobRepository;

    /**
     * Tìm kiếm việc làm với nhiều bộ lọc (US-006).
     */
    public List<JobResponse> searchJobs(String keyword, String location, String skill, String jobType) {
        // Sử dụng conjunction để tránh lỗi ambiguous call Specification.where(null)
        Specification<Job> spec = (root, query, cb) -> cb.conjunction();

        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.or(
                    cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("description")), "%" + keyword.toLowerCase() + "%")
                )
            );
        }

        if (skill != null && !skill.isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.or(
                    cb.like(cb.lower(root.get("title")), "%" + skill.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("description")), "%" + skill.toLowerCase() + "%")
                )
            );
        }

        if (location != null && !location.isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%")
            );
        }

        if (jobType != null && !jobType.isEmpty()) {
            try {
                Job.JobType type = Job.JobType.valueOf(jobType.toLowerCase());
                spec = spec.and((root, query, cb) -> cb.equal(root.get("jobType"), type));
            } catch (IllegalArgumentException e) {
                // Ignore invalid job type
            }
        }

        // Chỉ tìm các tin đang mở
        spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), Job.JobStatus.open));

        List<Job> jobs = jobRepository.findAll(spec);
        return jobs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompany().getName())
                .location(job.getLocation())
                .salary(job.getSalary())
                .jobType(job.getJobType().name())
                .status(job.getStatus().name())
                .deadline(job.getDeadline())
                .build();
    }
}
