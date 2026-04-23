package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.dto.EducationRequest;
import com.fivecore.jobportal.dto.StudentProfileRequest;
import com.fivecore.jobportal.entity.Education;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.EducationRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProfileServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private EducationRepository educationRepository;

    @InjectMocks
    private ProfileService profileService;

    private Student testStudent;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1);
        testUser.setFullName("Original Name");

        testStudent = new Student();
        testStudent.setId(1);
        testStudent.setUser(testUser);
        testStudent.setUniversity("Original Uni");
    }

    @Test
    @DisplayName("Test: Cập nhật thông tin hồ sơ đầy đủ")
    void testUpdateProfileSuccess() {
        StudentProfileRequest request = new StudentProfileRequest();
        request.setFullName("New Name");
        request.setUniversity("New Uni");
        request.setMajor("New Major");

        when(studentRepository.findById(1)).thenReturn(Optional.of(testStudent));

        profileService.updateProfile(1, request);

        assertEquals("New Name", testUser.getFullName());
        assertEquals("New Uni", testStudent.getUniversity());
        assertEquals("New Major", testStudent.getMajor());
        verify(studentRepository, times(1)).save(testStudent);
    }

    @Test
    @DisplayName("Test: Ném ngoại lệ khi cập nhật profile cho sinh viên không tồn tại")
    void testUpdateProfileStudentNotFound() {
        when(studentRepository.findById(999)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> profileService.updateProfile(999, new StudentProfileRequest()));
    }

    @Test
    @DisplayName("Test: Thêm học vấn - Ngày kết thúc hợp lệ")
    void testAddEducationSuccess() {
        Education edu = new Education();
        edu.setStartDate(LocalDate.of(2020, 1, 1));
        edu.setEndDate(LocalDate.of(2024, 1, 1));

        when(studentRepository.findById(1)).thenReturn(Optional.of(testStudent));
        when(educationRepository.save(any(Education.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Education result = profileService.addEducation(1, edu);

        assertNotNull(result);
        assertEquals(testStudent, result.getStudent());
    }

    @Test
    @DisplayName("Test: Thêm học vấn - Lỗi do ngày kết thúc trước ngày bắt đầu")
    void testAddEducationInvalidDate() {
        Education edu = new Education();
        edu.setStartDate(LocalDate.of(2024, 1, 1));
        edu.setEndDate(LocalDate.of(2020, 1, 1));

        assertThrows(IllegalArgumentException.class, () -> profileService.addEducation(1, edu));
    }

    @Test
    @DisplayName("Test: Cập nhật học vấn - Thành công")
    void testUpdateEducationSuccess() {
        Education edu = new Education();
        edu.setId(10);
        edu.setStudent(testStudent);

        EducationRequest request = new EducationRequest();
        request.setSchoolName("New School");

        when(educationRepository.findById(10)).thenReturn(Optional.of(edu));

        profileService.updateEducation(10, 1, request);

        assertEquals("New School", edu.getSchoolName());
        verify(educationRepository).save(edu);
    }

    @Test
    @DisplayName("Test: Cập nhật học vấn - Lỗi do không đúng quyền sở hữu")
    void testUpdateEducationUnauthorized() {
        Education edu = new Education();
        edu.setId(10);
        Student otherStudent = new Student();
        otherStudent.setId(2);
        edu.setStudent(otherStudent);

        when(educationRepository.findById(10)).thenReturn(Optional.of(edu));

        assertThrows(RuntimeException.class, () -> profileService.updateEducation(10, 1, new EducationRequest()));
    }

    @Test
    @DisplayName("Test: Xóa học vấn")
    void testDeleteEducation() {
        Education edu = new Education();
        edu.setId(10);
        edu.setStudent(testStudent);

        when(educationRepository.findById(10)).thenReturn(Optional.of(edu));

        profileService.deleteEducation(10, 1);

        verify(educationRepository).delete(edu);
    }
}
