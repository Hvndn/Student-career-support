package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.PasswordResetToken;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.PasswordResetTokenRepository;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.interaction.EmailService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordResetTokenRepository tokenRepository;
    @Mock
    private EmailService emailService;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PasswordResetService passwordResetService;

    @Test
    @DisplayName("Tạo token reset mật khẩu thành công")
    void createToken_Success() {
        // Given
        String email = "test@test.com";
        User user = User.builder().email(email).fullName("Test User").build();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // When
        boolean result = passwordResetService.createPasswordResetToken(email);

        // Then
        assertTrue(result);
        verify(tokenRepository).deleteByUser(user);
        verify(tokenRepository).save(any(PasswordResetToken.class));
        verify(emailService).sendSimpleEmail(eq(email), anyString(), anyString());
    }

    @Test
    @DisplayName("Tạo token thất bại khi email không tồn tại")
    void createToken_Fail_UserNotFound() {
        // Given
        String email = "notfound@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        boolean result = passwordResetService.createPasswordResetToken(email);

        // Then
        assertFalse(result);
        verify(tokenRepository, never()).save(any());
        verify(emailService, never()).sendSimpleEmail(anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("Reset mật khẩu thành công")
    void resetPassword_Success() {
        // Given
        String token = "valid-token";
        String newPassword = "newPassword123";
        User user = User.builder().email("test@test.com").build();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1))
                .build();

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(resetToken));
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPassword");

        // When
        boolean result = passwordResetService.resetPassword(token, newPassword);

        // Then
        assertTrue(result);
        verify(userRepository).save(user);
        verify(tokenRepository).delete(resetToken);
        assertEquals("encodedNewPassword", user.getPassword());
    }

    @Test
    @DisplayName("Reset mật khẩu thất bại khi token hết hạn")
    void resetPassword_Fail_TokenExpired() {
        // Given
        String token = "expired-token";
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .expiryDate(LocalDateTime.now().minusHours(1)) // Đã hết hạn
                .build();

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(resetToken));

        // When
        boolean result = passwordResetService.resetPassword(token, "newPass");

        // Then
        assertFalse(result);
        verify(userRepository, never()).save(any());
    }
}
