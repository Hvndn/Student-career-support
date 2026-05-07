package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Dịch vụ Quản lý Hồ sơ (US-011).
 * Tập trung vào các thông tin học vấn, kinh nghiệm và chứng chỉ.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final StudentRepository studentRepository;
    private final com.fivecore.jobportal.repository.SkillRepository skillRepository;
    private final com.fivecore.jobportal.repository.ProjectRepository projectRepository;


    /**
     * Cập nhật thông tin hồ sơ sinh viên (US-011).
     */
    @Transactional
    public void updateProfile(Integer studentId, com.fivecore.jobportal.dto.StudentProfileRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        // Cập nhật thông tin trong User entity
        com.fivecore.jobportal.entity.User user = student.getUser();
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }

        // Cập nhật thông tin trong Student entity
        if (request.getStudentIdStr() != null) student.setStudentIdStr(request.getStudentIdStr());
        if (request.getStudentClass() != null) student.setStudentClass(request.getStudentClass());
        if (request.getUniversity() != null) student.setUniversity(request.getUniversity());
        if (request.getMajor() != null) student.setMajor(request.getMajor());
        if (request.getGraduationYear() != null) student.setGraduationYear(request.getGraduationYear());
        if (request.getGpa() != null) student.setGpa(request.getGpa());
        if (request.getBio() != null) student.setBio(request.getBio());
        if (request.getPhone() != null) student.setPhone(request.getPhone());
        if (request.getAddress() != null) student.setAddress(request.getAddress());
        if (request.getGithubUrl() != null) student.setGithubUrl(request.getGithubUrl());
        if (request.getLinkedinUrl() != null) student.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getCvData() != null) student.setCvData(request.getCvData());

        studentRepository.save(student);
        log.info("Đã cập nhật thông tin hồ sơ cho sinh viên ID: {}", studentId);
    }

    /** Cập nhật riêng ảnh đại diện. */
    @Transactional
    public void updateAvatar(Integer studentId, String avatarUrl) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        student.setAvatarUrl(avatarUrl);
        studentRepository.save(student);
    }


    /** Cập nhật riêng CV (PDF). */
    @Transactional
    public void updateResumeUrl(Integer studentId, String resumeUrl) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        student.setResumeUrl(resumeUrl);
        studentRepository.save(student);
    }


    /** Quản lý Kỹ năng trong cvData (JSON). */
    @Transactional
    public void addSkill(Integer studentId, String skillName, String level) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        if (skillName == null || skillName.trim().isEmpty()) {
            throw new RuntimeException("Tên kỹ năng không được để trống");
        }
        
        String json = student.getCvData();
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.node.ObjectNode root = (json == null || json.isBlank()) 
                ? mapper.createObjectNode() 
                : (com.fasterxml.jackson.databind.node.ObjectNode) mapper.readTree(json);
            
            com.fasterxml.jackson.databind.node.ArrayNode skills = (com.fasterxml.jackson.databind.node.ArrayNode) root.get("skills");
            if (skills == null) skills = root.putArray("skills");
            
            // Tránh trùng lặp
            boolean exists = false;
            for (com.fasterxml.jackson.databind.JsonNode node : skills) {
                if (node.path("name").asText().equalsIgnoreCase(skillName.trim())) {
                    exists = true;
                    break;
                }
            }
            
            if (!exists) {
                com.fasterxml.jackson.databind.node.ObjectNode newSkill = mapper.createObjectNode();
                newSkill.put("name", skillName.trim());
                newSkill.put("level", level != null ? level : "intermediate");
                skills.add(newSkill);
                student.setCvData(mapper.writeValueAsString(root));
                studentRepository.save(student);
            }
        } catch (Exception e) { throw new RuntimeException("Lỗi xử lý JSON: " + e.getMessage()); }
    }

    @Transactional
    public void deleteSkill(Integer studentId, String skillName) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        String json = student.getCvData();
        if (json == null || json.isBlank()) return;
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.node.ObjectNode root = (com.fasterxml.jackson.databind.node.ObjectNode) mapper.readTree(json);
            com.fasterxml.jackson.databind.node.ArrayNode skills = (com.fasterxml.jackson.databind.node.ArrayNode) root.get("skills");
            if (skills != null) {
                for (int i = 0; i < skills.size(); i++) {
                    if (skills.get(i).path("name").asText().equalsIgnoreCase(skillName)) {
                        skills.remove(i);
                        break;
                    }
                }
                student.setCvData(mapper.writeValueAsString(root));
                studentRepository.save(student);
            }
        } catch (Exception e) { throw new RuntimeException("Lỗi xử lý JSON: " + e.getMessage()); }
    }

    /** Quản lý Dự án (Projects table). */
    @Transactional
    public void addProject(Integer studentId, com.fivecore.jobportal.entity.Project project) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        project.setStudent(student);
        if (project.getTitle() == null) {
            project.setTitle(project.getName());
        }
        projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Integer id, Integer studentId) {
        com.fivecore.jobportal.entity.Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dự án"));
        if (!project.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền xóa mục này");
        }
        projectRepository.delete(project);
    }
}
