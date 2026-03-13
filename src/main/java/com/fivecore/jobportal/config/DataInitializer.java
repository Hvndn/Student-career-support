package com.fivecore.jobportal.config;

import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

/**
 * Khởi tạo dữ liệu mẫu khi ứng dụng bắt đầu.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra nếu chưa có tài khoản nào thì tạo tài khoản mẫu
        if (userRepository.count() == 0) {
            User testUser = User.builder()
                    .email("test@example.com")
                    .password("123456") // Lưu ý: Trong thực tế nên dùng BCrypt
                    .fullName("Người Dùng Thử Nghiệm")
                    .role(User.Role.student)
                    .isActive(true)
                    .build();
            
            userRepository.save(testUser);
            log.info(">>>> Đã khởi tạo tài khoản mẫu: test@example.com / 123456");
        } else {
            log.info(">>>> Database đã có dữ liệu, bỏ qua bước khởi tạo.");
        }
    }
}
