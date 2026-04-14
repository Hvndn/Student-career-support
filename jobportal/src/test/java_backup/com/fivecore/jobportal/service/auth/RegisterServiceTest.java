package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.dto.RegisterRequest;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.CompanyRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegisterServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private CompanyRepository companyRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private RegisterService registerService;

    private RegisterRequest studentRequest;
    private RegisterRequest companyRequest;

    @BeforeEach
    void setUp() {
        studentRequest = new RegisterRequest();
        studentRequest.setEmail("student@test.com");
        studentRequest.setPassword("password123");
        studentRequest.setFullName("Student Name");
        studentRequest.setRole("student");

        companyRequest = new RegisterRequest();
        companyRequest.setEmail("company@test.com");
        companyRequest.setPassword("password123");
        companyRequest.setFullName("Company HR");
        companyRequest.setRole("company");
        companyRequest.setCompanyName("Company Name");
    }

    @Test
    @DisplayName("Đăng ký sinh viên thành công")
    void registerStudent_Success() {
        // Given
        when(userRepository.findByEmail(studentRequest.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(studentRequest.getPassword())).thenReturn("encodedPassword");
        
        User savedUser = User.builder()
                .id(1)
                .email(studentRequest.getEmail())
                .role(User.Role.student)
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        boolean result = registerService.register(studentRequest);

        // Then
        assertTrue(result);
        verify(userRepository).save(any(User.class));
        verify(studentRepository).save(any(Student.class));
        verify(companyRepository, never()).save(any(Company.class));
    }

    @Test
    @DisplayName("Đăng ký công ty thành công")
    void registerCompany_Success() {
        // Given
        when(userRepository.findByEmail(companyRequest.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(companyRequest.getPassword())).thenReturn("encodedPassword");
        
        User savedUser = User.builder()
                .id(2)
                .email(companyRequest.getEmail())
                .role(User.Role.company)
                .fullName(companyRequest.getFullName())
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        boolean result = registerService.register(companyRequest);

        // Then
        assertTrue(result);
        verify(userRepository).save(any(User.class));
        verify(companyRepository).save(any(Company.class));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    @DisplayName("Đăng ký thất bại khi email đã tồn tại")
    void register_Fail_EmailExists() {
        // Given
        when(userRepository.findByEmail(studentRequest.getEmail())).thenReturn(Optional.of(new User()));

        // When
        boolean result = registerService.register(studentRequest);

        // Then
        assertFalse(result);
        verify(userRepository, never()).save(any(User.class));
    }
}
