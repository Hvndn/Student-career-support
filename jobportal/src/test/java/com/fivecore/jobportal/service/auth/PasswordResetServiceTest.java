package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.PasswordResetRequest;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.PasswordResetRequestRepository;
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
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordResetRequestRepository requestRepository;
    @Mock
    private EmailService emailService;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PasswordResetService passwordResetService;

    @Test
    @DisplayName("Tạo yêu cầu reset mật khẩu thành công")
    void createRequest_Success() {
        // Given
        String email = "test@test.com";
        User user = User.builder().email(email).fullName("Test User").build();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(requestRepository.findByUserAndStatus(user, PasswordResetRequest.RequestStatus.PENDING))
            .thenReturn(Collections.emptyList());

        // When
        boolean result = passwordResetService.createPasswordResetRequest(email);

        // Then
        assertTrue(result);
        verify(requestRepository).save(any(PasswordResetRequest.class));
    }

    @Test
    @DisplayName("Phê duyệt yêu cầu thành công")
    void approveRequest_Success() {
        // Given
        Integer requestId = 1;
        User user = User.builder().email("test@test.com").fullName("Test User").build();
        PasswordResetRequest request = PasswordResetRequest.builder()
                .user(user)
                .status(PasswordResetRequest.RequestStatus.PENDING)
                .build();
        request.setId(requestId); // Dùng setter thay cho builder nếu builder lỗi

        when(requestRepository.findById(requestId)).thenReturn(Optional.of(request));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedNewPassword");

        // When
        boolean result = passwordResetService.approveRequest(requestId);

        // Then
        assertTrue(result);
        verify(userRepository).save(user);
        verify(requestRepository).save(request);
        verify(emailService).sendSimpleEmail(eq(user.getEmail()), anyString(), anyString());
        assertEquals(PasswordResetRequest.RequestStatus.COMPLETED, request.getStatus());
    }
}
