package com.fivecore.jobportal.service.student;

import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final com.fivecore.jobportal.repository.UserRepository userRepository;

    /**
     * Lấy studentId từ Email (US-006 support).
     */
    public Integer getStudentIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(user -> user.getStudent() != null ? user.getStudent().getId() : null)
                .orElse(null);
    }

    /**
     * Tìm kiếm việc làm với nhiều bộ lọc (US-006).
     */
    @Transactional(readOnly = true)
    public List<JobResponse> searchJobs(String keyword, String location, String industry, String jobType, 
                                       java.math.BigDecimal minSalary, java.math.BigDecimal maxSalary, Integer studentId) {
        // Sử dụng conjunction để tránh lỗi ambiguous call Specification.where(null)
        Specification<Job> spec = (root, query, cb) -> cb.conjunction();

        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("description")), "%" + keyword.toLowerCase() + "%")));
        }

        if (industry != null && !industry.isEmpty() && !"all".equalsIgnoreCase(industry)) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("industry")), "%" + industry.toLowerCase() + "%"));
        }

        if (minSalary != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("minSalary"), minSalary));
        }

        if (maxSalary != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("maxSalary"), maxSalary));
        }

        if (location != null && !location.isEmpty()) {
            spec = spec.and(
                    (root, query, cb) -> cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
        }

        if (jobType != null && !jobType.isEmpty()) {
            try {
                Job.JobType type = Enum.valueOf(Job.JobType.class, jobType.toLowerCase());
                spec = spec.and((root, query, cb) -> cb.equal(root.get("jobType"), type));
            } catch (IllegalArgumentException e) {
                // Ignore invalid job type
            }
        }

        // Chỉ tìm các tin đang mở
        spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), Job.JobStatus.open));

        List<Job> jobs = jobRepository.findAll(spec);
        
        List<Integer> savedJobIds = List.of();
        if (studentId != null) {
            savedJobIds = jobRepository.findSavedJobIdsByStudentId(studentId);
        }

        final List<Integer> finalSavedJobIds = savedJobIds;
        return jobs.stream()
                .map(job -> mapToResponse(job, finalSavedJobIds.contains(job.getId())))
                .collect(Collectors.toList());
    }

    /**
     * Lấy thông tin chi tiết một công việc theo ID.
     */
    public JobResponse getJobById(Integer id) {
        return getJobById(id, null);
    }

    /**
     * Lấy thông tin chi tiết một công việc theo ID, có kèm studentId để kiểm tra
     * trạng thái (US-006).
     */
    public JobResponse getJobById(Integer id, Integer studentId) {
        return jobRepository.findById(id)
                .map(job -> {
                    boolean isSaved = false;
                    if (studentId != null) {
                        isSaved = jobRepository.findSavedJobIdsByStudentId(studentId).contains(job.getId());
                    }
                    return mapToResponse(job, isSaved);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc với ID: " + id));
    }

    public JobResponse mapToResponse(Job job, boolean isSaved) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompany() != null ? job.getCompany().getName() : "DAU Partner")
                .location(job.getLocation())
                .salary(job.getMaxSalary() != null ? job.getMinSalary() + " - " + job.getMaxSalary() : (job.getMinSalary() != null ? job.getMinSalary().toString() : "Thỏa thuận"))
                .jobType(job.getJobType().name())
                .status(job.getStatus().name())
                .description(job.getDescription())
                .industry(job.getIndustry())
                .deadline(job.getDeadline())
                .postedAt(job.getPostedAt())
                .imageUrl(job.getCompany() != null ? job.getCompany().getLogoUrl() : null)
                .isSaved(isSaved)
                .build();
    }
}
