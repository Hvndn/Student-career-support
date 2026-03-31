package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.dto.LoginRequest;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("checkEmailExists should return true if email exists")
    void testCheckEmailExists_Exists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
        assertTrue(authService.checkEmailExists("test@example.com"));
    }

    @Test
    @DisplayName("checkEmailExists should return false if email does not exist")
    void testCheckEmailExists_NotExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        assertFalse(authService.checkEmailExists("test@example.com"));
    }

    @Test
    @DisplayName("sendResetPasswordEmail should execute without errors")
    void testSendResetPasswordEmail() {
        assertDoesNotThrow(() -> authService.sendResetPasswordEmail("test@example.com"));
    }

}
