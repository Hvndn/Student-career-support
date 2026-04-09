package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.PasswordResetRequest;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.PasswordResetRequestRepository;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.interaction.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Dịch vụ Khôi phục Mật khẩu - Xử lý logic yêu cầu cấp lại mật khẩu bởi Admin.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetRequestRepository requestRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Tạo yêu cầu cấp lại mật khẩu và lưu vào hệ thống cho Admin duyệt.
     * @param email Email của người dùng cần reset
     * @return true nếu email tồn tại và đã tạo yêu cầu, ngược lại false
     */
    @Transactional
    public boolean createPasswordResetRequest(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            log.warn("Yêu cầu reset mật khẩu cho email không tồn tại: {}", email);
            return false;
        }

        User user = userOptional.get();
        
        // Kiểm tra xem đã có yêu cầu PENDING chưa
        List<PasswordResetRequest> pendingRequests = requestRepository.findByUserAndStatus(user, PasswordResetRequest.RequestStatus.PENDING);
        if (!pendingRequests.isEmpty()) {
            log.info("Đã có yêu cầu đang chờ xử lý cho email: {}", email);
            return true;
        }

        // Tạo yêu cầu mới
        PasswordResetRequest request = PasswordResetRequest.builder()
                .user(user)
                .requestDate(LocalDateTime.now())
                .status(PasswordResetRequest.RequestStatus.PENDING)
                .build();

        requestRepository.save(request);
        log.info("Đã tạo yêu cầu cấp lại mật khẩu cho: {}", email);
        
        return true;
    }

    /**
     * Lấy danh sách toàn bộ yêu cầu đang chờ xử lý.
     */
    public List<PasswordResetRequest> getAllPendingRequests() {
        return requestRepository.findByStatus(PasswordResetRequest.RequestStatus.PENDING);
    }

    /**
     * Admin phê duyệt yêu cầu: Tự động tạo mật khẩu mới và gửi mail.
     * @param requestId ID của yêu cầu
     * @return true nếu thành công
     */
    @Transactional
    public boolean approveRequest(Integer requestId) {
        Optional<PasswordResetRequest> requestOpt = requestRepository.findById(requestId);
        if (requestOpt.isEmpty() || requestOpt.get().getStatus() == PasswordResetRequest.RequestStatus.COMPLETED) {
            return false;
        }

        PasswordResetRequest request = requestOpt.get();
        User user = request.getUser();

        // 1. Tạo mật khẩu ngẫu nhiên (8 ký tự)
        String newPassword = UUID.randomUUID().toString().substring(0, 8);
        
        // 2. Cập nhật mật khẩu vào DB (Mã hóa)
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 3. Gửi email thông báo mật khẩu mới
        String emailContent = "Chào " + user.getFullName() + ",\n\n" +
                "Yêu cầu cấp lại mật khẩu của bạn đã được Quản trị viên phê duyệt.\n" +
                "Mật khẩu mới của bạn là: " + newPassword + "\n\n" +
                "Vui lòng đăng nhập và đổi mật khẩu ngay để đảm bảo an toàn.\n" +
                "Trân trọng,\nFivecore Team";

        emailService.sendSimpleEmail(user.getEmail(), "[Student Career] Mật khẩu mới của bạn", emailContent);

        // 4. Cập nhật trạng thái yêu cầu
        request.setStatus(PasswordResetRequest.RequestStatus.COMPLETED);
        requestRepository.save(request);

        log.info("Admin đã cấp lại mật khẩu thành công cho người dùng: {}", user.getEmail());
        return true;
    }
}
