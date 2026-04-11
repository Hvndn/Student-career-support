package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.dto.RegisterRequest;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.CompanyRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Dịch vụ xử lý đăng ký tài khoản người dùng mới.
 * Tuân thủ nguyên tắc Single Responsibility bằng cách tách biệt logic đăng ký.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RegisterService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Thực hiện đăng ký người dùng mới vào hệ thống.
     * Logic bao gồm xác thực email, mã hóa mật khẩu và tạo hồ sơ bổ sung tương ứng với vai trò.
     *
     * @param request Thông tin đăng ký từ người dùng
     * @return true nếu thành công, false nếu email đã tồn tại
     */
    @Transactional
    public boolean register(RegisterRequest request) {
        // 1. Kiểm tra email đã tồn tại (Logic validate cơ bản)
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("Đăng ký không thành công: Email {} đã tồn tại.", request.getEmail());
            return false;
        }

        // 2. Xác định vai trò (Mặc định là student nếu không hợp lệ)
        User.Role role = User.Role.student;
        if ("company".equalsIgnoreCase(request.getRole())) {
            role = User.Role.company;
        }

        boolean isActive = true; // Cho phép đăng nhập ngay sau khi đăng ký

        // 3. Tạo Entity User mới với mật khẩu đã được mã hóa BCrypt
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // Mã hóa bảo mật
                .fullName(request.getFullName())
                .role(role)
                .isActive(isActive)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Đã tạo tài khoản cơ bản cho email: {}, ID: {}", savedUser.getEmail(), savedUser.getId());

        // 4. Khởi tạo hồ sơ chi tiết dựa trên vai trò (Student hoặc Company)
        initProfile(savedUser, request);

        return true;
    }

    /**
     * Khởi tạo hồ sơ rỗng cho người dùng dựa trên vai trò để sẵn sàng cập nhật sau này.
     */
    private void initProfile(User user, RegisterRequest request) {
        if (user.getRole() == User.Role.student) {
            String studentIdStr = request.getStudentIdStr();
            if (studentIdStr == null || studentIdStr.trim().isEmpty()) {
                // Tự động tạo mã sinh viên nếu không được cung cấp
                studentIdStr = "SV" + System.currentTimeMillis() % 1000000;
            }
            Student student = Student.builder()
                    .user(user)
                    .studentIdStr(studentIdStr)
                    .build();
            studentRepository.save(student);
            log.info("Đã khởi tạo hồ sơ Sinh viên với mã: {} cho ID: {}", studentIdStr, user.getId());
        } else if (user.getRole() == User.Role.company) {
            Company company = Company.builder()
                    .user(user)
                    .name(request.getCompanyName() != null && !request.getCompanyName().isEmpty() ? request.getCompanyName() : user.getFullName())
                    .phone(request.getPhone())
                    .email(user.getEmail())
                    .build();
            companyRepository.save(company);
            log.info("Đã khởi tạo hồ sơ Công ty cho ID: {}", user.getId());
        }
    }

    /**
     * Thay đổi mật khẩu cho người dùng đã đăng nhập.
     * 
     * @param email Email của người dùng hiện tại
     * @param request DTO chứa mật khẩu cũ và mới
     * @return true nếu thành công, false nếu mật khẩu cũ không đúng
     */
    @Transactional
    public boolean changePassword(String email, com.fivecore.jobportal.dto.ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            log.warn("Đổi mật khẩu thất bại cho email {}: Mật khẩu hiện tại không khớp.", email);
            return false;
        }

        // Cập nhật mật khẩu mới (Mã hóa)
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        log.info("Đã đổi mật khẩu thành công cho email: {}", email);
        return true;
    }
}
