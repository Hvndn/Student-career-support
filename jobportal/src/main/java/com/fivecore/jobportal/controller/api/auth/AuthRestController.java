package com.fivecore.jobportal.controller.api.auth;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.dto.LoginRequest;
import com.fivecore.jobportal.dto.RegisterRequest;
import com.fivecore.jobportal.service.auth.AuthService;
import com.fivecore.jobportal.service.auth.PasswordResetService;
import com.fivecore.jobportal.service.auth.RegisterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;
import com.fivecore.jobportal.repository.UserRepository;

/**
 * REST API Controller cho Xác thực (Login & Register).
 * Thay thế logic của AuthController (MVC).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthRestController {

    private final RegisterService registerService;
    private final PasswordResetService passwordResetService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final UserRepository userRepository;

    /**
     * API Đăng nhập.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Object>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        // Save the security context to the repository (Required for manual auth in Spring Security 6)
        securityContextRepository.saveContext(SecurityContextHolder.getContext(), httpRequest, httpResponse);

        String role = auth.getAuthorities().stream()
                .map(r -> r.getAuthority())
                .findFirst().orElse("");

        // Get the user's full name from the database
        String fullName = request.getEmail();
        var userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            fullName = userOpt.get().getFullName();
        }

        Map<String, Object> data = Map.of(
                "email", request.getEmail(),
                "role", role,
                "fullName", fullName != null ? fullName : request.getEmail(),
                "message", "Đăng nhập thành công"
        );

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
}
