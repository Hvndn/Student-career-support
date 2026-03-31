package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.CompanyRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Dịch vụ xử lý thông tin người dùng từ Google OAuth2.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        try {
            return processOAuth2User(oAuth2User);
        } catch (Exception ex) {
            log.error("Lỗi khi xử lý OAuth2 user: ", ex);
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        if (email == null) {
            throw new RuntimeException("Email không tìm thấy từ Google");
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Cập nhật tên nếu cần
            if (name != null && !name.equals(user.getFullName())) {
                user.setFullName(name);
                userRepository.save(user);
            }
        } else {
            user = registerNewUser(email, name);
        }

        return oAuth2User;
    }

    private User registerNewUser(String email, String name) {
        // Lấy vai trò từ session (được set từ endpoint khởi đầu login)
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(false);
        String roleStr = (session != null) ? (String) session.getAttribute("oauth2_role") : "student";
        
        User.Role role = User.Role.student;
        if ("company".equalsIgnoreCase(roleStr)) {
            role = User.Role.company;
        }

        User user = User.builder()
                .email(email)
                .fullName(name != null ? name : email)
                .password(UUID.randomUUID().toString()) // Mật khẩu ngẫu nhiên cho OAuth2 user
                .role(role)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Đã tạo tài khoản Google mới: {}, Vai trò: {}", email, role);

        // Khởi tạo hồ sơ rỗng
        initProfile(savedUser);

        return savedUser;
    }

    private void initProfile(User user) {
        if (user.getRole() == User.Role.student) {
            String studentCode = "SV" + System.currentTimeMillis() % 1000000;
            Student student = Student.builder()
                    .user(user)
                    .studentCode(studentCode)
                    .build();
            studentRepository.save(student);
        } else if (user.getRole() == User.Role.company) {
            Company company = Company.builder()
                    .user(user)
                    .name(user.getFullName())
                    .email(user.getEmail())
                    .build();
            companyRepository.save(company);
        }
    }
}
