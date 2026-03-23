package com.fivecore.jobportal.config;

import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Khởi tạo tài khoản Admin mặc định khi ứng dụng bắt đầu.
 * Nếu tài khoản đã tồn tại thì bỏ qua.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@unitalent.vn";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Super Admin")
                    .role(User.Role.admin)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            log.info("✅ Đã tạo tài khoản Admin mặc định: {}", adminEmail);
        } else {
            // Đảm bảo mật khẩu luôn đúng (reset nếu cần)
            userRepository.findByEmail(adminEmail).ifPresent(user -> {
                user.setPassword(passwordEncoder.encode("admin123"));
                user.setRole(User.Role.admin);
                user.setActive(true);
                userRepository.save(user);
                log.info("🔄 Đã cập nhật tài khoản Admin: {}", adminEmail);
            });
        }
    }
}
