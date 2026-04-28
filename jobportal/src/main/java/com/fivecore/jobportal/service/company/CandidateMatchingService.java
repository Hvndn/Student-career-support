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
        
        return allStudents.stream()
                .map(student -> {
                    java.util.Map<String, Object> matchDetails = new java.util.HashMap<>();
                    double score = calculateDetailedScore(student, job, matchDetails);
                    
                    StudentProfileResponse response = studentProfileMapper.toResponse(student.getUser(), student);
                    response.setMatchScore(score);
                    response.setMatchDetails(matchDetails);
                    return response;
                })
                .filter(res -> res.getMatchScore() >= 10) // Chỉ hiện ứng viên có điểm từ 10 trở lên
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore())) // Sắp xếp giảm dần
                .limit(30) // Lấy tối đa 30 người phù hợp nhất
                .collect(Collectors.toList());
    }

    public double calculateDetailedScore(Student student, Job job, java.util.Map<String, Object> details) {
        double totalScore = 0;

        // 1. Kỹ năng (Skills Matching) - Trọng số 30%
        double skillScore = calculateSkillScore(student, job, details);
        totalScore += skillScore;

        // 2. Kinh nghiệm (Experience) - Trọng số 25%
        double expScore = calculateExperienceScore(student, job, details);
        totalScore += expScore;

        // 3. Dự án & Portfolio - Trọng số 15%
        double projectScore = calculateProjectScore(student, details);
        totalScore += projectScore;

        // 4. Học vấn & Chuyên ngành - Trọng số 10%
        double eduScore = calculateEducationScore(student, job, details);
        totalScore += eduScore;

        // 5. Địa điểm & Hình thức - Trọng số 10%
        double locationScore = calculateLocationScore(student, job, details);
        totalScore += locationScore;

        // 6. Ngoại ngữ & Kỹ năng mềm - Trọng số 10%
        double softSkillScore = calculateSoftSkillScore(student, details);
        totalScore += softSkillScore;

        return Math.min(100.0, totalScore);
    }

    private double calculateSkillScore(Student student, Job job, java.util.Map<String, Object> details) {
        List<String> jobSkills = job.getSkills().stream()
                .map(js -> js.getSkill().getName().toLowerCase())
                .collect(Collectors.toList());
        
        if (jobSkills.isEmpty()) {
            details.put("skills", "N/A");
            return 5.0; // Giảm từ 20 xuống 5 để tránh ảo điểm khi Job thiếu dữ liệu
        }

        List<JsonNode> studentSkillsNodes = getStudentSkillsNodes(student);
        long matches = 0;
        double weightedMatches = 0;

        for (String js : jobSkills) {
            for (JsonNode sn : studentSkillsNodes) {
                String sName = (sn.has("name") ? sn.get("name").asText() : sn.path("skillName").asText()).toLowerCase();
                if (sName.contains(js) || js.contains(sName)) {
                    matches++;
                    String level = sn.path("level").asText("intermediate").toLowerCase();
                    if (level.equals("advanced")) weightedMatches += 1.2;
                    else if (level.equals("beginner")) weightedMatches += 0.8;
                    else weightedMatches += 1.0;
                    break;
                }
            }
        }

        double score = (weightedMatches / jobSkills.size()) * 30.0;
        details.put("skillsMatch", String.format("%d/%d", matches, jobSkills.size()));
        details.put("skillsScore", Math.round(score * 10) / 10.0);
        return score;
    }

    private double calculateExperienceScore(Student student, Job job, java.util.Map<String, Object> details) {
        double totalYears = 0;
        for (com.fivecore.jobportal.entity.Experience exp : student.getExperiences()) {
            java.time.LocalDate start = exp.getStartDate();
            java.time.LocalDate end = exp.getEndDate() != null ? exp.getEndDate() : java.time.LocalDate.now();
            if (start != null) {
                totalYears += java.time.temporal.ChronoUnit.DAYS.between(start, end) / 365.0;
            }
        }

        int requiredYears = parseRequiredExperience(job.getExperience());
        double score = 0;

        if (totalYears >= requiredYears) score += 15;
        else if (totalYears >= requiredYears * 0.7) score += 10;
        else score += 5;

        // Kiểm tra độ tương đồng vị trí
        boolean roleMatch = student.getExperiences().stream()
                .anyMatch(exp -> {
                    String title = exp.getJobTitle().toLowerCase();
                    String jobTitle = job.getTitle().toLowerCase();
                    return title.contains(jobTitle) || jobTitle.contains(title);
                });
        
        if (roleMatch) score += 10;

        details.put("experienceYears", Math.round(totalYears * 10) / 10.0);
        details.put("experienceScore", score);
        return score;
    }

    private int parseRequiredExperience(String expStr) {
        if (expStr == null || expStr.isEmpty()) return 0;
        String numeric = expStr.replaceAll("[^0-9]", "");
        return numeric.isEmpty() ? 0 : Integer.parseInt(numeric);
    }

    private double calculateProjectScore(Student student, java.util.Map<String, Object> details) {
        double score = 0;
        if (student.getGithubUrl() != null && !student.getGithubUrl().isBlank()) score += 7;
        if (student.getProjects() != null && student.getProjects().size() >= 2) score += 8;
        else if (student.getProjects() != null && !student.getProjects().isEmpty()) score += 4;

        details.put("projectScore", score);
        details.put("hasGithub", student.getGithubUrl() != null);
        return score;
    }

    private double calculateEducationScore(Student student, Job job, java.util.Map<String, Object> details) {
        double score = 0;
        String major = student.getMajor() != null ? student.getMajor().toLowerCase() : "";
        String industry = job.getIndustry() != null ? job.getIndustry().toLowerCase() : "";

        if (!industry.isEmpty() && !major.isEmpty()) {
            if (major.contains(industry) || industry.contains(major)) {
                score = 10;
            } else if (isSameCluster(major, industry)) {
                score = 7;
            }
        }
        
        if (student.getGpa() != null) {
            if (student.getGpa() >= 3.2) score += 2; // Bonus small for GPA in edu section
        }

        details.put("educationScore", score);
        return score;
    }

    private double calculateLocationScore(Student student, Job job, java.util.Map<String, Object> details) {
        double score = 0;
        // Kiểm tra địa điểm
        if (student.getAddress() != null && job.getLocation() != null) {
            if (student.getAddress().toLowerCase().contains(job.getLocation().toLowerCase()) ||
                job.getLocation().toLowerCase().contains(student.getAddress().toLowerCase())) {
                score += 5;
            }
        } else if (job.getJobType() == Job.JobType.remote) {
            score += 5;
        }

        // Kiểm tra loại hình
        if (job.getJobType() != null) {
            score += 5; // Mặc định cho điểm loại hình nếu không có thông tin phản đối
        }

        details.put("locationScore", score);
        return score;
    }

    private double calculateSoftSkillScore(Student student, java.util.Map<String, Object> details) {
        double score = 0;
        String cvData = student.getCvData();
        if (cvData == null || cvData.isBlank()) return 0;

        String cvLower = cvData.toLowerCase();
        // Kiểm tra ngoại ngữ
        if (cvLower.contains("ielts") || cvLower.contains("toeic") || cvLower.contains("english") || cvLower.contains("tiếng anh")) {
            score += 5;
        }

        // Kiểm tra kỹ năng mềm
        if (cvLower.contains("communication") || cvLower.contains("teamwork") || cvLower.contains("problem solving") || 
            cvLower.contains("giao tiếp") || cvLower.contains("làm việc nhóm")) {
            score += 5;
        }

        details.put("softSkillScore", score);
        return score;
    }

    private boolean isSameCluster(String major, String industry) {
        // Cụm Công nghệ & Kỹ thuật
        if ((major.contains("cntt") || major.contains("công nghệ thông tin") || major.contains("phần mềm") || major.contains("máy tính") || major.contains("it")) && 
            (industry.contains("it") || industry.contains("công nghệ thông tin") || industry.contains("phần mềm") || industry.contains("tech") || industry.contains("phát triển"))) return true;
        
        // Cụm Kinh tế & Kinh doanh
        if ((major.contains("kinh tế") || major.contains("quản trị") || major.contains("marketing") || major.contains("tài chính") || major.contains("kế toán")) && 
            (industry.contains("kinh doanh") || industry.contains("marketing") || industry.contains("tài chính") || industry.contains("dịch vụ") || industry.contains("thương mại"))) return true;

        return false;
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
