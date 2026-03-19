package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.dto.LoginRequest;
import com.fivecore.jobportal.dto.RegisterRequest;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


/**
 * Dịch vụ xác thực người dùng.
 */
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;




    public boolean checkEmailExists(String email) {
    return userRepository.existsByEmail(email);
}

public void sendResetPasswordEmail(String email) {
    // Tạm thời chỉ log để test
    System.out.println("Send reset password email to: " + email);
}
}
