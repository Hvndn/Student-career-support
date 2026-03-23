package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.PasswordResetToken;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.PasswordResetTokenRepository;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.interaction.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Dịch vụ Khôi phục Mật khẩu - Xử lý logic quên mật khẩu và đặt lại mật khẩu.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Tạo token reset và gửi email cho người dùng.
     * @param email Email của người dùng cần reset
     * @return true nếu email tồn tại và đã gửi, ngược lại false
     */
    @Transactional
    public boolean createPasswordResetToken(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            log.warn("Yêu cầu reset mật khẩu cho email không tồn tại: {}", email);
            return false;
        }

        User user = userOptional.get();
        // Xóa token cũ nếu có
        tokenRepository.deleteByUser(user);

        // Tạo token mới ngẫu nhiên
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(2)) // Hết hạn sau 2 giờ
                .build();

        tokenRepository.save(resetToken);

        // Gửi email (Giả lập link reset)
        String resetLink = "http://localhost:8080/reset-password?token=" + token;
        String emailContent = "Chào " + user.getFullName() + ",\n\n" +
                "Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào link bên dưới để thực hiện:\n" +
                resetLink + "\n\n" +
                "Link này sẽ hết hạn sau 2 giờ.\n" +
                "Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.";

        emailService.sendSimpleEmail(user.getEmail(), "[Student Career] Khôi phục mật khẩu", emailContent);
        
        return true;
    }

    /**
     * Thực hiện đặt lại mật khẩu mới.
     * @param token Mã xác thực
     * @param newPassword Mật khẩu mới
     * @return true nếu reset thành công, false nếu token không hợp lệ hoặc hết hạn
     */
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
        
        if (tokenOptional.isEmpty() || tokenOptional.get().isExpired()) {
            log.warn("Token reset mật khẩu không hợp lệ hoặc đã hết hạn: {}", token);
            return false;
        }

        PasswordResetToken resetToken = tokenOptional.get();
        User user = resetToken.getUser();
        
        // Cập nhật mật khẩu mới (Mã hóa)
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Xóa token sau khi dùng xong
        tokenRepository.delete(resetToken);
        log.info("Đã đặt lại mật khẩu thành công cho người dùng: {}", user.getEmail());
        
        return true;
    }
}
