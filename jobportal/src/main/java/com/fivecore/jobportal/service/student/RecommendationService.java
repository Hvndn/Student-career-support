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
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Dịch vụ Gợi ý Việc làm (US-020).
 * Sử dụng thuật toán khớp kỹ năng cơ bản để đưa ra danh sách job phù hợp.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final JobRepository jobRepository;
    private final StudentRepository studentRepository;

    /**
     * Gợi ý các công việc phù hợp nhất cho sinh viên dựa trên kỹ năng.
     */
    public List<JobResponse> recommendJobs(Integer studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        Set<String> studentSkillNames = student.getSkills().stream()
                .map(ss -> ss.getSkill().getName().toLowerCase())
                .collect(Collectors.toSet());

        if (studentSkillNames.isEmpty()) {
            log.warn("Sinh viên {} chưa cập nhật kỹ năng, không thể gợi ý.", studentId);
            return List.of();
        }

        // Lấy toàn bộ Job đang mở
        List<Job> allJobs = jobRepository.findAll().stream()
                .filter(j -> j.getStatus() == Job.JobStatus.open)
                .collect(Collectors.toList());

        // Thuật toán: Sắp xếp theo số lượng kỹ năng trùng khớp (Giả lập logic thông minh)
        return allJobs.stream()
                .sorted((j1, j2) -> {
                    long count1 = countMatchingSkills(j1, studentSkillNames);
                    long count2 = countMatchingSkills(j2, studentSkillNames);
                    return Long.compare(count2, count1); // Giảm dần
                })
                .limit(5) // Lấy top 5
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompany().getName())
                .industry(job.getIndustry())
                .level(job.getLevel())
                .location(job.getLocation())
                .region(job.getRegion())
                .salaryType(job.getSalaryType())
                .minSalary(job.getMinSalary())
                .maxSalary(job.getMaxSalary())
                .jobType(job.getJobType().name())
                .experience(job.getExperience())
                .qualification(job.getQualification())
                .status(job.getStatus().name())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .deadline(job.getDeadline())
                .quantity(job.getQuantity())
                .gender(job.getGender())
                .contactName(job.getContactName())
                .contactEmail(job.getContactEmail())
                .contactPhone(job.getContactPhone())
                .build();
    }

    private long countMatchingSkills(Job job, Set<String> studentSkills) {
        // Trong thực tế, Job sẽ có JobSkill. Ở đây ta giả lập search keyword trong description
        return studentSkills.stream()
                .filter(skill -> job.getTitle().toLowerCase().contains(skill) || 
                                 job.getDescription().toLowerCase().contains(skill))
                .count();
    }
}
