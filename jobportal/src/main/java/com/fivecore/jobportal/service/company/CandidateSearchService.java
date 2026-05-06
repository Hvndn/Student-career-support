package com.fivecore.jobportal.service.company;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fivecore.jobportal.dto.StudentProfileResponse;
import com.fivecore.jobportal.entity.Application;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.ApplicationRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.controller.api.student.StudentProfileMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Dịch vụ tìm kiếm và xem chi tiết ứng viên dành cho Doanh nghiệp.
 */
@Service
public class CandidateSearchService {

    private final StudentRepository studentRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentProfileMapper studentProfileMapper;
    private final ObjectMapper objectMapper;

    private final CandidateMatchingService candidateMatchingService;

    public CandidateSearchService(
            StudentRepository studentRepository,
            ApplicationRepository applicationRepository,
            StudentProfileMapper studentProfileMapper,
            ObjectMapper objectMapper,
            CandidateMatchingService candidateMatchingService) {
        this.studentRepository = studentRepository;
        this.applicationRepository = applicationRepository;
        this.studentProfileMapper = studentProfileMapper;
        this.objectMapper = objectMapper;
        this.candidateMatchingService = candidateMatchingService;
    }

    /**
     * Tìm kiếm sinh viên theo tên, chuyên ngành hoặc kỹ năng.
     */
    public List<StudentProfileResponse> searchStudents(String query, String skill) {
        List<Student> students = studentRepository.findAll();
        
        return students.stream()
                .filter(s -> {
                    boolean matchesQuery = true;
                    User u = s.getUser();
                    if (query != null && !query.isBlank()) {
                        String q = query.toLowerCase();
                        matchesQuery = (u != null && u.getFullName() != null && u.getFullName().toLowerCase().contains(q)) || 
                                       (u != null && u.getEmail() != null && u.getEmail().toLowerCase().contains(q)) ||
                                       (s.getMajor() != null && s.getMajor().toLowerCase().contains(q));
                    }
                    
                    boolean matchesSkill = true;
                    if (skill != null && !skill.isBlank()) {
                        String sk = skill.toLowerCase();
                        String cvData = s.getCvData();
                        matchesSkill = cvData != null && cvData.toLowerCase().contains(sk);
                    }
                    
                    return matchesQuery && matchesSkill;
                })
                .map(s -> studentProfileMapper.toResponse(s.getUser(), s))
                .collect(Collectors.toList());
    }

    /**
     * Lấy profile sinh viên theo ID.
     */
    public StudentProfileResponse getStudentById(Integer studentId) {
        return studentRepository.findById(studentId)
                .map(s -> studentProfileMapper.toResponse(s.getUser(), s))
                .orElse(null);
    }

    /**
     * Lấy chi tiết ứng viên cho giao diện Quản lý Tuyển dụng (Premium View).
     */
    public Map<String, Object> getCandidateDetail(Integer applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + applicationId));
        Student s = app.getStudent();

        Map<String, Object> res = new HashMap<>();
        res.put("id", app.getId());
        res.put("status", app.getStatus());
        res.put("appliedAt", app.getAppliedAt());
        res.put("jobTitle", app.getJob() != null ? app.getJob().getTitle() : "N/A");
        res.put("jobType", app.getJob() != null ? app.getJob().getJobType() : "N/A");
        res.put("jobLocation", app.getJob() != null ? app.getJob().getLocation() : "N/A");
        res.put("coverLetter", app.getCoverLetter());
        res.put("cvUrl", app.getCvUrl());
        res.put("applicationStatus", app.getStatus());

        if (s != null) {
            StudentProfileResponse profile = studentProfileMapper.toResponse(s.getUser(), s);
            
            // Map chính xác các trường từ DTO vào Map kết quả (làm phẳng cho frontend)
            res.put("studentId", s.getId());
            res.put("fullName", profile.getFullName());
            res.put("email", profile.getEmail());
            res.put("phone", profile.getPhone());
            res.put("avatarUrl", profile.getAvatarUrl());
            res.put("major", profile.getMajor() != null ? profile.getMajor() : "Chưa cập nhật");
            res.put("studentIdStr", profile.getStudentIdStr());
            res.put("location", profile.getAddress());
            res.put("address", profile.getAddress());
            res.put("gpa", profile.getGpa());
            res.put("skills", profile.getSkills());
            res.put("projects", profile.getProjects());
            res.put("educations", profile.getEducations());
            res.put("experiences", profile.getExperiences());
            res.put("bio", profile.getBio());
            res.put("cvData", profile.getCvData());
            res.put("resumeUrl", profile.getResumeUrl());
            
            // Phân tích AI
            Map<String, Object> matchDetails = new HashMap<>();
            double matchScore = candidateMatchingService.calculateDetailedScore(s, app.getJob(), matchDetails);
            res.put("matchScore", matchScore);
            res.put("matchDetails", matchDetails);
            
            // Toàn bộ profile DTO để dùng cho các component con
            res.put("studentProfile", profile);
        }

        return res;
    }
}
