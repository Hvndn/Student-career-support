package com.fivecore.jobportal.service.student;

import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Dịch vụ Gợi ý Việc làm (US-020).
 * Gợi ý việc làm phù hợp dựa trên chuyên ngành của sinh viên.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final JobRepository jobRepository;
    private final StudentRepository studentRepository;

    /**
     * Gợi ý các công việc phù hợp nhất cho sinh viên dựa trên chuyên ngành.
     */
    public List<JobResponse> recommendJobs(Integer studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        String major = student.getMajor();
        if (major == null || major.isBlank()) {
            log.warn("Sinh viên {} chưa cập nhật chuyên ngành, trả về danh sách mới nhất.", studentId);
        }

        // Lấy toàn bộ Job đang mở, ưu tiên job liên quan đến ngành học
        List<Job> allJobs = jobRepository.findAll().stream()
                .filter(j -> j.getStatus() == Job.JobStatus.open)
                .collect(Collectors.toList());

        return allJobs.stream()
                .sorted((j1, j2) -> {
                    long score1 = majorRelevanceScore(j1, major);
                    long score2 = majorRelevanceScore(j2, major);
                    return Long.compare(score2, score1);
                })
                .limit(5)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private long majorRelevanceScore(Job job, String major) {
        if (major == null) return 0;
        String m = major.toLowerCase();
        long score = 0;
        if (job.getTitle().toLowerCase().contains(m)) score += 2;
        if (job.getIndustry() != null && job.getIndustry().toLowerCase().contains(m)) score += 2;
        if (job.getDescription() != null && job.getDescription().toLowerCase().contains(m)) score += 1;
        return score;
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompany().getName())
                .location(job.getLocation())
                .salary(job.getMinSalary() != null ? job.getMinSalary().toString() + (job.getMaxSalary() != null ? " - " + job.getMaxSalary().toString() : "") : "Thỏa thuận")
                .jobType(job.getJobType().name())
                .status(job.getStatus().name())
                .deadline(job.getDeadline())
                .build();
    }
}
