package com.fivecore.jobportal.service.company;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fivecore.jobportal.dto.StudentProfileResponse;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.controller.api.student.StudentProfileMapper;
import com.fivecore.jobportal.service.company.matching.MatchingConfig;
import com.fivecore.jobportal.service.company.matching.ScoringFactor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Dịch vụ gợi ý ứng viên phù hợp dựa trên thuật toán so khớp Industry/Major và Kỹ năng.
 * Sử dụng kiến trúc Modular Scoring.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateMatchingService {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final StudentProfileMapper studentProfileMapper;
    private final List<ScoringFactor> scoringFactors;
    private final MatchingConfig matchingConfig;
    private final ObjectMapper objectMapper;

    /**
     * [BE Logic] Lấy danh sách các ứng viên gợi ý cho một công việc cụ thể.
     * 1. Duyệt qua toàn bộ sinh viên trong DB [DB] students
     * 2. Với mỗi sinh viên, tính toán điểm so khớp (Match Score) dựa trên thuật toán Modular Scoring.
     * 3. Sắp xếp theo điểm cao nhất và lấy Top 30 ứng viên phù hợp.
     */
    public List<StudentProfileResponse> getRecommendedCandidates(Integer jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc"));

        List<Student> allStudents = studentRepository.findAll();
        
        return allStudents.stream()
                .map(student -> {
                    java.util.Map<String, Object> matchDetails = new java.util.HashMap<>();
                    double score = calculateDetailedScore(student, job, matchDetails);
                    
                    StudentProfileResponse response = studentProfileMapper.toResponse(student.getUser(), student);
                    response.setMatchScore(score);
                    response.setMatchDetails(matchDetails);
                    return response;
                })
                .filter(res -> res.getMatchScore() >= 10) 
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore())) 
                .limit(30) 
                .collect(Collectors.toList());
    }

    /**
     * [BE Logic] Thuật toán tính điểm chi tiết (Modular Scoring Engine).
     * Duyệt qua các nhân tố (ScoringFactor): Kỹ năng, Kinh nghiệm, Học vấn, Dự án, Vị trí.
     * Mỗi nhân tố sẽ có trọng số (Weight) cấu hình trong MatchingConfig.
     * Trả về tổng điểm và chi tiết breakdown (lý do chấm điểm) để hiển thị ở Frontend.
     */
    public double calculateDetailedScore(Student student, Job job, java.util.Map<String, Object> details) {
        double weightedTotal = 0;
        java.util.Map<String, Object> breakdown = new java.util.HashMap<>();

        for (ScoringFactor factor : scoringFactors) {
            String name = factor.getName();
            if (matchingConfig.isEnabled(name)) {
                double weight = matchingConfig.getWeight(name);
                java.util.Map<String, Object> factorDetails = new java.util.HashMap<>();
                
                double factorScore = factor.calculate(student, job, factorDetails);
                double weightedScore = factorScore * weight * 100.0;
                
                weightedTotal += weightedScore;

                // Lưu breakdown cho UI (Dữ liệu này sẽ được FE component StudentProfileModal tiêu thụ)
                java.util.Map<String, Object> factorInfo = new java.util.HashMap<>();
                factorInfo.put("score", Math.round(factorScore * 100));
                factorInfo.put("weight", weight);
                factorInfo.put("contribution", Math.round(weightedScore * 10) / 10.0);
                factorInfo.putAll(factorDetails);
                
                breakdown.put(name, factorInfo);
            }
        }

        details.put("breakdown", breakdown);
        details.put("engine_version", "1.0-modular");
        
        return Math.min(100.0, Math.round(weightedTotal * 10) / 10.0);
    }

    private List<JsonNode> getStudentSkillsNodes(Student student) {
        List<JsonNode> nodes = new ArrayList<>();
        String json = student.getCvData();
        if (json == null || json.isBlank()) return nodes;
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode skillsNode = root.get("skills");
            if (skillsNode != null && skillsNode.isArray()) {
                for (JsonNode node : skillsNode) nodes.add(node);
            }
        } catch (Exception e) {
            log.warn("Lỗi khi parse skills cho student ID {}: {}", student.getId(), e.getMessage());
        }
        return nodes;
    }
}
