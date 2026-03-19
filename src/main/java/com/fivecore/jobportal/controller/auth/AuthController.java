package com.fivecore.jobportal.controller.auth;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fivecore.jobportal.dto.LoginRequest;
import com.fivecore.jobportal.dto.RegisterRequest;
import com.fivecore.jobportal.service.auth.AuthService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.validation.Valid;
import org.springframework.security.web.context.SecurityContextRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContext;
import lombok.RequiredArgsConstructor;

/**
 * Bộ điều khiển xác thực MVC (Đăng nhập & Đăng ký).
 */
@Controller
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final com.fivecore.jobportal.service.auth.RegisterService registerService;
    private final com.fivecore.jobportal.service.auth.PasswordResetService passwordResetService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    /**
     * Hiển thị trang đăng nhập chung cho tất cả vai trò.
     */
    @GetMapping("/login")
    public String showLoginPage(Model model) {
        model.addAttribute("loginRequest", new LoginRequest());
        return "auth/login";
    }
    /**
     * Xử lý đăng nhập.
     */
    @PostMapping("/login")
    public String login(@Valid @ModelAttribute("loginRequest") LoginRequest request,
                        BindingResult result, 
                        HttpServletRequest httpServletRequest,
                        HttpServletResponse httpServletResponse,
                        Model model) {
        if (result.hasErrors()) {
            return "auth/login_students";
        }

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);
            httpServletRequest.getSession(true);
            securityContextRepository.saveContext(context, httpServletRequest, httpServletResponse);
            String role = auth.getAuthorities().stream()
                    .map(r -> r.getAuthority())
                    .findFirst().orElse("");
            if (role.contains("ADMIN")) return "redirect:/admin/dashboard";
            if (role.contains("COMPANY")) return "redirect:/company/dashboard";
            return "redirect:/student/dashboard";
        } catch (AuthenticationException e) {
            model.addAttribute("error", "Email hoặc mật khẩu không chính xác");
            return "auth/login";
        }
    }
    /**
     * employer/login redirect về /login chung.
     */
    @GetMapping("/employer/login")
    public String showEmployerLoginPage() {
        return "redirect:/login";
    }

    /**
     * Trang đăng ký hợp nhất: chọn vai trò hoặc hiển thị form.
     */
    @GetMapping("/register")
    public String showRegisterPage(@RequestParam(value = "role", required = false) String role, Model model) {
        if (role != null) {
            model.addAttribute("registerRole", role);
            model.addAttribute("registerRequest", new RegisterRequest());
        }
        return "auth/register";
    }
@PostMapping("/employer/login")
public String employerLogin(@Valid @ModelAttribute("loginRequest") LoginRequest request,
                            BindingResult result,
                            HttpServletRequest httpServletRequest,
                            HttpServletResponse httpServletResponse,
                            Model model) {

    if (result.hasErrors()) {
        return "auth/login_employer";
    }

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);
            httpServletRequest.getSession(true); // Đảm bảo session được tạo
            securityContextRepository.saveContext(context, httpServletRequest, httpServletResponse);
            
            // Chuyển hướng dựa trên vai trò
            String role = auth.getAuthorities().stream()
                    .map(r -> r.getAuthority())
                    .findFirst()
                    .orElse("");
            
            if (role.contains("ADMIN")) {
                return "redirect:/admin/dashboard";
            } else if (role.contains("COMPANY")) {
                return "redirect:/company/dashboard";
            }
            return "redirect:/student/dashboard";
        } catch (AuthenticationException e) {
            model.addAttribute("error", "Email hoặc mật khẩu không đúng");
            return "auth/login_employer";
        }
}

    @GetMapping("/students/register")
    public String registerStudent(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "auth/register_student";
    }

    @PostMapping("/students/register")
    public String processRegisterStudent(@Valid @ModelAttribute("registerRequest") RegisterRequest request,
                                         BindingResult result,
                                         Model model) {
        if (result.hasErrors()) {
            return "auth/register_student";
        }
        
        request.setRole("student");
        boolean success = registerService.register(request);
        
        if (success) {
            model.addAttribute("message", "Đăng ký sinh viên thành công! Vui lòng đăng nhập.");
            model.addAttribute("loginRequest", new LoginRequest());
            return "auth/login_students";
        } else {
            model.addAttribute("error", "Email đã tồn tại trong hệ thống");
            return "auth/register_student";
        }
    }

    @GetMapping("/employer/register")
    public String registerRecruiter(Model model){
        model.addAttribute("registerRequest", new RegisterRequest());
        return "auth/register_employer";
    }

    @PostMapping("/employer/register")
    public String registerEmployer(@Valid @ModelAttribute("registerRequest") RegisterRequest request,
                                   BindingResult result,
                                   Model model) {

        if (result.hasErrors()) {
            return "auth/register_employer";
        }

        request.setRole("company");
        boolean success = registerService.register(request);

        if (success) {
            model.addAttribute("message", "Đăng ký doanh nghiệp thành công! Vui lòng đăng nhập.");
            model.addAttribute("loginRequest", new LoginRequest());
            return "auth/login_employer";
        } else {
            model.addAttribute("error", "Email đã tồn tại trong hệ thống");
            return "auth/register_employer";
        }
    }

    /**
     * Hiển thị trang yêu cầu khôi phục mật khẩu.
     */
    @GetMapping("/forgot-password")
    public String showForgotPasswordPage() {
        return "auth/forgot_password";
    }

    /**
     * Xử lý yêu cầu gửi email khôi phục mật khẩu.
     */
    @PostMapping("/forgot-password")
    public String processForgotPassword(@org.springframework.web.bind.annotation.RequestParam("email") String email, Model model) {
        boolean success = passwordResetService.createPasswordResetToken(email);
        if (success) {
            model.addAttribute("message", "Link khôi phục mật khẩu đã được gửi tới email của bạn.");
        } else {
            model.addAttribute("error", "Email không tồn tại trong hệ thống.");
        }
        return "auth/forgot_password";
    }

    /**
     * Hiển thị trang đặt lại mật khẩu mới.
     */
    @GetMapping("/reset-password")
    public String showResetPasswordPage(@org.springframework.web.bind.annotation.RequestParam("token") String token, Model model) {
        model.addAttribute("token", token);
        return "auth/reset_password";
    }

    /**
     * Xử lý đặt lại mật khẩu mới.
     */
    @PostMapping("/reset-password")
    public String processResetPassword(@org.springframework.web.bind.annotation.RequestParam("token") String token,
                                       @org.springframework.web.bind.annotation.RequestParam("password") String password,
                                       Model model) {
        boolean success = passwordResetService.resetPassword(token, password);
        if (success) {
            model.addAttribute("message", "Mật khẩu đã được thay đổi thành công. Vui lòng đăng nhập.");
            return "auth/login_students";
        } else {
            model.addAttribute("error", "Token không hợp lệ hoặc đã hết hạn.");
            return "auth/reset_password";
        }
    }
}
