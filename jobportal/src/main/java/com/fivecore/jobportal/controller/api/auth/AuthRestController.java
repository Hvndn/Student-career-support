package com.fivecore.jobportal.controller.api.auth;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.dto.LoginRequest;
import com.fivecore.jobportal.dto.RegisterRequest;
import com.fivecore.jobportal.security.JwtTokenProvider;
import com.fivecore.jobportal.service.auth.PasswordResetService;
import com.fivecore.jobportal.service.auth.RegisterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;
import java.util.Map;
import com.fivecore.jobportal.repository.UserRepository;

/**
 * REST API Controller cho Xác thực (Login & Register).
 * Sử dụng JWT thay cho Session.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthRestController {

    private final RegisterService registerService;
    private final PasswordResetService passwordResetService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    /**
     * API Đăng nhập. Trả về JWT Token.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Object>> login(
            @Valid @RequestBody LoginRequest request) {
        
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        // Tạo JWT Token
        String token = tokenProvider.generateToken(auth);

        String role = auth.getAuthorities().stream()
                .map(r -> r.getAuthority())
                .findFirst().orElse("");

        // Lấy thông tin họ tên từ DB
        String fullName = request.getEmail();
        var userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            fullName = userOpt.get().getFullName();
        }

        Map<String, Object> data = new HashMap<>();
        data.put("email", request.getEmail());
        data.put("role", role);
        data.put("fullName", fullName != null ? fullName : request.getEmail());
        data.put("token", token);
        data.put("tokenType", "Bearer");
        data.put("message", "Đăng nhập thành công");

        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", data));
    }

    /**
     * API Đăng ký.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Object>> register(@Valid @RequestBody RegisterRequest request) {
        boolean success = registerService.register(request);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công", null));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email đã tồn tại trong hệ thống", "EMAIL_EXISTS"));
        }
    }

    /**
     * API Yêu cầu khôi phục mật khẩu.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Object>> forgotPassword(@RequestParam("email") String email) {
        boolean success = passwordResetService.createPasswordResetToken(email);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("Link khôi phục mật khẩu đã được gửi tới email", null));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email không tồn tại trong hệ thống", "EMAIL_NOT_FOUND"));
        }
    }

    /**
     * API Đặt lại mật khẩu mới.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Object>> resetPassword(@RequestParam("token") String token,
                                                           @RequestParam("password") String password) {
        boolean success = passwordResetService.resetPassword(token, password);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("Mật khẩu đã được thay đổi thành công", null));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Token không hợp lệ hoặc đã hết hạn", "INVALID_TOKEN"));
        }
    }

    /**
     * API Lấy thông tin người dùng hiện tại (dùng cho OAuth2 và kiểm tra token).
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Object>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập", "UNAUTHORIZED"));
        }

        String email = authentication.getName();
        // Nếu là OAuth2User thì lấy email từ attributes
        if (authentication.getPrincipal() instanceof org.springframework.security.oauth2.core.user.OAuth2User oauth2User) {
            email = oauth2User.getAttribute("email");
        }

        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.error("Người dùng không tồn tại", "USER_NOT_FOUND"));
        }

        var user = userOpt.get();
        String role = user.getRole().toString().toUpperCase();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        Map<String, Object> data = Map.of(
                "email", user.getEmail(),
                "role", role,
                "fullName", user.getFullName(),
                "message", "Lấy thông tin thành công"
        );

        return ResponseEntity.ok(ApiResponse.success("Thành công", data));
    }

    /**
     * Endpoint khởi động đăng nhập Google với vai trò được chọn.
     */
    @GetMapping("/google/login")
    public void googleLogin(@RequestParam("role") String role, 
                            HttpServletRequest request, 
                            HttpServletResponse response) throws java.io.IOException {
        request.getSession().setAttribute("oauth2_role", role);
        // Redirect tới endpoint mặc định của Spring Security OAuth2
        response.sendRedirect("/oauth2/authorization/google");
    }
}
