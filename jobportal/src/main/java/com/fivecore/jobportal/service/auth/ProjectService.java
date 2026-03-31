package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.Project;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.ProjectRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Dịch vụ Quản lý Dự án (US-004).
 * Hỗ trợ các chức năng Thêm, Xoá, Sửa dự án cho sinh viên.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final StudentRepository studentRepository;

    /**
     * Lấy danh sách dự án của một sinh viên.
     */
    public List<Project> getProjectsByStudent(Integer studentId) {
        return projectRepository.findByStudentId(studentId);
    }

    /**
     * Thêm dự án mới cho sinh viên.
     */
    @Transactional
    public Project addProject(Integer studentId, Project projectData) {
        java.util.Objects.requireNonNull(studentId, "Student ID cannot be null");
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        if (projectData.getRepositoryUrl() != null && !projectData.getRepositoryUrl().isEmpty()) {
            if (!projectData.getRepositoryUrl().matches("^(https?://)?(www\\.)?github\\.com/.*$")) {
                throw new IllegalArgumentException("Link Repository không đúng định dạng URL");
            }
        }

        projectData.setStudent(student);
        Project savedProject = projectRepository.save(projectData);
        log.info("Đã thêm dự án mới: {} cho sinh viên ID: {}", savedProject.getName(), studentId);
        return savedProject;
    }

    @Transactional
    public Project updateProject(Integer id, Integer studentId, Project projectData) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dự án"));
        
        if (!existing.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền sửa dự án này");
        }

        existing.setName(projectData.getName());
        existing.setDescription(projectData.getDescription());
        existing.setTechStack(projectData.getTechStack());
        existing.setRole(projectData.getRole());
        existing.setRepositoryUrl(projectData.getRepositoryUrl());
        existing.setDemoUrl(projectData.getDemoUrl());

        log.info("Đã cập nhật dự án ID: {}", id);
        return projectRepository.save(existing);
    }

    /**
     * Xóa dự án (Chỉ cho phép nếu đúng chủ sở hữu).
     */
    @Transactional
    public void deleteProject(Integer projectId, Integer studentId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dự án"));

        if (!project.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền xóa dự án này");
        }

        projectRepository.delete(project);
        log.info("Đã xóa dự án ID: {}", projectId);
    }
}
