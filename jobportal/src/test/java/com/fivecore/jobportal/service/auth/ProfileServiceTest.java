package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.dto.EducationRequest;
import com.fivecore.jobportal.dto.ExperienceRequest;
import com.fivecore.jobportal.dto.StudentProfileRequest;
import com.fivecore.jobportal.entity.Education;
import com.fivecore.jobportal.entity.Experience;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.EducationRepository;
import com.fivecore.jobportal.repository.ExperienceRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private EducationRepository educationRepository;

    @Mock
    private ExperienceRepository experienceRepository;

    @InjectMocks
    private ProfileService profileService;

    @Test
    @DisplayName("Thêm Education thành công")
    void addEducation_Success() {
        Student student = new Student();
        student.setId(1);
        
        Education edu = new Education();
        edu.setSchoolName("HUST");
        edu.setStartDate(LocalDate.of(2020, 9, 1));
        edu.setEndDate(LocalDate.of(2024, 6, 1));

        when(studentRepository.findById(1)).thenReturn(Optional.of(student));
        when(educationRepository.save(any(Education.class))).thenAnswer(i -> i.getArgument(0));

        Education result = profileService.addEducation(1, edu);

        assertNotNull(result);
        assertEquals("HUST", result.getSchoolName());
        assertEquals(student, result.getStudent());
    }

    @Test
    @DisplayName("Thêm Education thất bại khi EndDate < StartDate")
    void addEducation_Fail_InvalidDates() {
        Education edu = new Education();
        edu.setStartDate(LocalDate.of(2020, 9, 1));
        edu.setEndDate(LocalDate.of(2019, 1, 1)); // Invalid

        assertThrows(IllegalArgumentException.class, () -> profileService.addEducation(1, edu));
        verify(studentRepository, never()).findById(any());
        verify(educationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Thêm Experience thành công")
    void addExperience_Success() {
        Student student = new Student();
        student.setId(1);

        Experience exp = new Experience();
        exp.setCompanyName("Google");
        exp.setStartDate(LocalDate.of(2023, 1, 1));
        exp.setEndDate(LocalDate.of(2024, 1, 1));

        when(studentRepository.findById(1)).thenReturn(Optional.of(student));
        when(experienceRepository.save(any(Experience.class))).thenAnswer(i -> i.getArgument(0));

        Experience result = profileService.addExperience(1, exp);

        assertNotNull(result);
        assertEquals("Google", result.getCompanyName());
        assertEquals(student, result.getStudent());
    }

    @Test
    @DisplayName("Cập nhật thông tin profile sinh viên")
    void updateProfile_Success() {
        User user = new User();
        user.setFullName("Old Name");
        
        Student student = new Student();
        student.setId(1);
        student.setUser(user);
        
        StudentProfileRequest request = new StudentProfileRequest();
        request.setFullName("New Name");
        request.setUniversity("FPT");
        request.setGpa(3.8);

        when(studentRepository.findById(1)).thenReturn(Optional.of(student));

        profileService.updateProfile(1, request);

        verify(studentRepository).save(student);
        assertEquals("New Name", student.getUser().getFullName());
        assertEquals("FPT", student.getUniversity());
        assertEquals(3.8, student.getGpa());
    }
}
