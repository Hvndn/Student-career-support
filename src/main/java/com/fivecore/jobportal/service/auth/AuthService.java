package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.dto.LoginRequest;
import com.fivecore.jobportal.dto.RegisterRequest;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Dịch vụ xác thực người dùng.
 */
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;

    /**
     * Xử lý logic đăng nhập.
     * @param request Thông tin đăng nhập
     * @return true nếu thông tin chính xác, ngược lại false
     */
    public boolean login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // So sánh mật khẩu trực tiếp (Cần nâng cấp lên BCrypt trong tương lai)
            return user.getPassword().equals(request.getPassword());
        }
        
        return false;
    }

    /**
     * Xử lý logic đăng ký người dùng mới.
     * @param request Thông tin đăng ký
     * @return true nếu đăng ký thành công, false nếu email đã tồn tại
     */
    public boolean register(RegisterRequest request) {
        // Kiểm tra email đã tồn tại chưa
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return false;
        }

        // Tạo người dùng mới
        User.Role userRole = User.Role.student;
        if ("company".equalsIgnoreCase(request.getRole())) {
            userRole = User.Role.company;
        }

        User newUser = User.builder()
                .email(request.getEmail())
                .password(request.getPassword()) // Trong thực tế cần mã hóa mật khẩu
                .fullName(request.getFullName())
                .role(userRole)
                .isActive(true)
                .build();

        userRepository.save(newUser);
        return true;
    }
}
