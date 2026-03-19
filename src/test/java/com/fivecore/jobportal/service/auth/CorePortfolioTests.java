package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CorePortfolioTests {

    @Mock private SkillRepository skillRepository;
    @Mock private StudentSkillRepository studentSkillRepository;
    @Mock private StudentRepository studentRepository;
    @Mock private ProjectRepository projectRepository;
    @Mock private CertificateRepository certificateRepository;

    @InjectMocks private SkillService skillService;
    @InjectMocks private ProjectService projectService;
    @InjectMocks private ProfileService profileService;

    @Test
    @DisplayName("Thêm kỹ năng cho sinh viên thành công")
    void addSkill_Success() {
        Student student = new Student();
        student.setId(1);
        Skill skill = new Skill();
        skill.setId(1);
        skill.setName("Java");

        when(studentRepository.findById(1)).thenReturn(Optional.of(student));
        when(skillRepository.findById(1)).thenReturn(Optional.of(skill));

        skillService.addSkillToStudent(1, 1, StudentSkill.SkillLevel.intermediate);

        verify(studentSkillRepository).save(any(StudentSkill.class));
    }

    @Test
    @DisplayName("Thêm dự án cho sinh viên thành công")
    void addProject_Success() {
        Student student = new Student();
        student.setId(1);
        Project project = Project.builder().name("AI Project").build();

        when(studentRepository.findById(1)).thenReturn(Optional.of(student));
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Project result = projectService.addProject(1, project);

        assertNotNull(result);
        assertEquals("AI Project", result.getName());
        assertEquals(student, result.getStudent());
    }

    @Test
    @DisplayName("Cập nhật học vấn thành công")
    void updateEducation_Success() {
        Student student = new Student();
        student.setId(1);

        when(studentRepository.findById(1)).thenReturn(Optional.of(student));

        profileService.updateEducation(1, "HUST", "IT", 2026, null);

        verify(studentRepository).save(student);
        assertEquals("HUST", student.getUniversity());
    }
}
