package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.dto.ChangePasswordRequest;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RegisterServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private StudentRepository studentRepository;
    @Mock private CompanyRepository companyRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private RegisterService registerService;

    @BeforeEach
    void setUp() {
    }

    @Test
    @DisplayName("Test: Đăng ký Sinh viên - Thành công")
    void testRegisterStudentSuccess() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("new@student.com");
        req.setPassword("pass");
        req.setFullName("Student Name");
        req.setRole("student");
        req.setStudentIdStr("SV007");

        when(userRepository.findByEmail("new@student.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(1);
            return u;
        });

        boolean result = registerService.register(req);

        assertTrue(result);
        verify(studentRepository).save(argThat(s -> s.getStudentIdStr().equals("SV007")));
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Test: Đăng ký Công ty - Thành công")
    void testRegisterCompanySuccess() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("company@test.com");
        req.setRole("company");
        req.setCompanyName("Happy Corp");

        when(userRepository.findByEmail("company@test.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(2);
            return u;
        });

        boolean result = registerService.register(req);

        assertTrue(result);
        verify(companyRepository).save(argThat(c -> c.getName().equals("Happy Corp")));
    }

    @Test
    @DisplayName("Test: Đăng ký - Thất bại do trùng Email")
    void testRegisterEmailExists() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("exists@test.com");

        when(userRepository.findByEmail("exists@test.com")).thenReturn(Optional.of(new User()));

        boolean result = registerService.register(req);

        assertFalse(result);
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Test: Đổi mật khẩu - Thành công")
    void testChangePasswordSuccess() {
        User user = new User();
        user.setEmail("user@test.com");
        user.setPassword("old_encoded");

        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("old");
        req.setNewPassword("new");

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old", "old_encoded")).thenReturn(true);
        when(passwordEncoder.encode("new")).thenReturn("new_encoded");

        boolean result = registerService.changePassword("user@test.com", req);

        assertTrue(result);
        assertEquals("new_encoded", user.getPassword());
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("Test: Đổi mật khẩu - Thất bại do mật khẩu cũ sai")
    void testChangePasswordWrongOld() {
        User user = new User();
        user.setPassword("old_encoded");

        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("wrong");

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "old_encoded")).thenReturn(false);

        boolean result = registerService.changePassword("user@test.com", req);

        assertFalse(result);
        verify(userRepository, never()).save(user);
    }
}
