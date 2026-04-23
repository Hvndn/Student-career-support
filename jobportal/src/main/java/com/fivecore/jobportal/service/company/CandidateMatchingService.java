package com.fivecore.jobportal.service.company;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fivecore.jobportal.dto.StudentProfileResponse;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.JobSkill;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.controller.api.student.StudentProfileMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Dịch vụ gợi ý ứng viên phù hợp dựa trên thuật toán so khớp Industry/Major và Kỹ năng.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateMatchingService {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final StudentProfileMapper studentProfileMapper;
    private final ObjectMapper objectMapper;

    /**
     * Lấy danh sách các ứng viên gợi ý cho một công việc cụ thể.
     */
    public List<StudentProfileResponse> getRecommendedCandidates(Integer jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc"));

        List<Student> allStudents = studentRepository.findAll();
        
        List<StudentProfileResponse> recommendations = allStudents.stream()
                .map(student -> {
                    double score = calculateMatchScore(student, job);
                    StudentProfileResponse response = studentProfileMapper.toResponse(student.getUser(), student);
                    response.setMatchScore(score);
                    return response;
                })
                .filter(res -> res.getMatchScore() > 0) // Chỉ hiện ứng viên có điểm > 0
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore())) // Sắp xếp giảm dần
                .limit(20) // Lấy tối đa 20 người phù hợp nhất
                .collect(Collectors.toList());

        return recommendations;
    }

    private double calculateMatchScore(Student student, Job job) {
        double score = 0;

        // 1. Phù hợp theo Ngành (Industry) và Chuyên ngành (Major) - Trọng số 40%
        String major = student.getMajor() != null ? student.getMajor().toLowerCase() : "";
        String industry = job.getIndustry() != null ? job.getIndustry().toLowerCase() : "";

        if (!industry.isEmpty() && !major.isEmpty()) {
            if (major.contains(industry) || industry.contains(major)) {
                score += 40;
            } else if (isSameCluster(major, industry)) {
                score += 30;
            }
        }

        // 2. Phù hợp theo Kỹ năng (Skills) - Trọng số 50%
        List<String> jobSkills = job.getSkills().stream()
                .map(js -> js.getSkill().getName().toLowerCase())
                .collect(Collectors.toList());
        
        List<String> studentSkills = getStudentSkills(student);

        if (!jobSkills.isEmpty()) {
            long matches = jobSkills.stream()
                    .filter(js -> studentSkills.stream().anyMatch(ss -> ss.contains(js) || js.contains(ss)))
                    .count();
            
            double skillScore = (double) matches / jobSkills.size() * 50;
            score += skillScore;
        } else {
            // Nếu job không yêu cầu kỹ năng cụ thể, phần này mặc định được 25 điểm nếu ngành khớp
            if (score >= 30) score += 25;
        }

        // 3. Phụ trợ (GPA, kinh nghiệm...) - Trọng số 10%
        if (student.getGpa() != null && student.getGpa() >= 3.2) {
            score += 10;
        } else if (student.getGpa() != null && student.getGpa() >= 2.5) {
            score += 5;
        }

        return Math.min(100.0, score);
    }

    private boolean isSameCluster(String major, String industry) {
        // Một số cụm ngành liên quan
        if ((major.contains("cntt") || major.contains("phần mềm") || major.contains("máy tính")) && 
            (industry.contains("it") || industry.contains("phần mềm") || industry.contains("tech"))) return true;
        
        if ((major.contains("kinh tế") || major.contains("quản trị") || major.contains("marketing")) && 
            (industry.contains("kinh doanh") || industry.contains("marketing") || industry.contains("tài chính"))) return true;

        if ((major.contains("ngôn ngữ") || major.contains("sư phạm")) && 
            (industry.contains("giáo dục") || industry.contains("dịch thuật"))) return true;

        return false;
    }

    private List<String> getStudentSkills(Student student) {
        List<String> skills = new ArrayList<>();
        String json = student.getCvData();
        if (json == null || json.isBlank()) return skills;
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode skillsNode = root.get("skills");
            if (skillsNode != null && skillsNode.isArray()) {
                for (JsonNode node : skillsNode) {
                    if (node.has("name")) skills.add(node.get("name").asText().toLowerCase());
                    else if (node.has("skillName")) skills.add(node.get("skillName").asText().toLowerCase());
                }
            }
        } catch (Exception e) {
            log.warn("Lỗi khi parse skills cho student ID {}: {}", student.getId(), e.getMessage());
        }
        return skills;
    }
}
