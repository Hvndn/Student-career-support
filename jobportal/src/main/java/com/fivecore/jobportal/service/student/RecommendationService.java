package com.fivecore.jobportal.service.student;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.JobSkill;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Dịch vụ Gợi ý Việc làm Thông minh (CV-based Matching).
 * Gợi ý việc làm dựa trên Kỹ năng trong CV và Chuyên ngành.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final JobRepository jobRepository;
    private final StudentRepository studentRepository;
    private final ObjectMapper objectMapper; // Jackson mapper for JSON parsing

    /**
     * Gợi ý các công việc phù hợp nhất dựa trên dữ liệu CV và Chuyên ngành.
     */
    public List<JobResponse> recommendJobs(Integer studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        // 1. Lấy thông tin từ CV (JSON)
        Set<String> studentSkills = extractSkillsFromCv(student.getCvData());
        String major = student.getMajor();
        String bio = student.getBio();

        // 2. Lấy toàn bộ Job đang mở
        List<Job> openJobs = jobRepository.findAll().stream()
                .filter(j -> j.getStatus() == Job.JobStatus.open)
                .collect(Collectors.toList());

        // 3. Tính điểm và sắp xếp
        return openJobs.stream()
                .map(job -> {
                    long score = calculateMatchScore(job, major, bio, studentSkills);
                    return new JobWithScore(job, score);
                })
                .sorted(Comparator.comparingLong(JobWithScore::getScore).reversed())
                .limit(5)
                .map(js -> mapToResponse(js.getJob()))
                .collect(Collectors.toList());
    }

    private Set<String> extractSkillsFromCv(String cvDataJson) {
        Set<String> skills = new HashSet<>();
        if (cvDataJson == null || cvDataJson.isBlank()) return skills;

        try {
            JsonNode root = objectMapper.readTree(cvDataJson);
            JsonNode skillsNode = root.get("skills");
            if (skillsNode != null && skillsNode.isArray()) {
                for (JsonNode skill : skillsNode) {
                    JsonNode nameNode = skill.get("name");
                    if (nameNode == null) nameNode = skill.get("skillName"); // fallback
                    if (nameNode != null) {
                        skills.add(nameNode.asText().toLowerCase().trim());
                    }
                }
            }
        } catch (Exception e) {
            log.error("Lỗi khi parse cvData cho gợi ý: {}", e.getMessage());
        }
        return skills;
    }

    private long calculateMatchScore(Job job, String major, String bio, Set<String> studentSkills) {
        long score = 0;

        // Tiêu chí 1: Khớp kỹ năng (Mạnh nhất - 10đ mỗi skill)
        if (job.getSkills() != null && !studentSkills.isEmpty()) {
            for (JobSkill js : job.getSkills()) {
                if (js.getSkill() != null && studentSkills.contains(js.getSkill().getName().toLowerCase().trim())) {
                    score += 10;
                }
            }
        }

        // Tiêu chí 2: Khớp chuyên ngành (5đ)
        if (major != null) {
            String m = major.toLowerCase();
            if (job.getTitle().toLowerCase().contains(m)) score += 5;
            if (job.getIndustry() != null && job.getIndustry().toLowerCase().contains(m)) score += 5;
        }

        // Tiêu chí 3: Khớp từ khóa trong mô tả và mục tiêu (2đ)
        if (bio != null && job.getDescription() != null) {
            // Logic đơn giản: nếu bio chứa tiêu đề công việc hoặc ngược lại
            if (job.getDescription().toLowerCase().contains(bio.toLowerCase())) score += 2;
        }

        return score;
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompany().getName())
                .imageUrl(job.getCompany().getLogoUrl()) // Map logoUrl to imageUrl for frontend
                .location(job.getLocation())
                .minSalary(job.getMinSalary())
                .maxSalary(job.getMaxSalary())
                .jobType(job.getJobType().name())
                .status(job.getStatus().name())
                .deadline(job.getDeadline())
                .postedAt(job.getPostedAt())
                .build();
    }

    @lombok.Getter
    @RequiredArgsConstructor
    private static class JobWithScore {
        private final Job job;
        private final long score;
    }
}
