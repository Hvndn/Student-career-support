package com.fivecore.jobportal.controller.auth;

import com.fivecore.jobportal.dto.LoginRequest;
import com.fivecore.jobportal.dto.RegisterRequest;
import com.fivecore.jobportal.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

/**
 * Bộ điều khiển xác thực MVC (Đăng nhập & Đăng ký).
 */
@Controller
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    /**
     * Hiển thị trang đăng nhập.
     */
    @GetMapping("/login")
    public String showLoginPage(Model model) {
        model.addAttribute("loginRequest", new LoginRequest());
        return "login";
    }

    /**
     * Xử lý đăng nhập.
     */
    @PostMapping("/login")
    public String login(@Valid @ModelAttribute("loginRequest") LoginRequest request,
                        BindingResult result, Model model) {
        if (result.hasErrors()) {
            return "login";
        }

        boolean success = authService.login(request);
        
        if (success) {
            // Trong thực tế sẽ thiết lập session/cookie ở đây
            return "redirect:/dashboard";
        } else {
            model.addAttribute("error", "Email hoặc mật khẩu không chính xác");
            return "login";
        }
    }

    /**
     * Hiển thị trang đăng ký.
     */
    @GetMapping("/register")
    public String showRegisterPage(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "register";
    }

    /**
     * Xử lý đăng ký tài khoản mới.
     */
    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("registerRequest") RegisterRequest request,
                           BindingResult result, Model model) {
        if (result.hasErrors()) {
            return "register";
        }

        boolean success = authService.register(request);
        
        if (success) {
            model.addAttribute("message", "Đăng ký thành công! Vui lòng đăng nhập.");
            model.addAttribute("loginRequest", new LoginRequest());
            return "login";
        } else {
            model.addAttribute("error", "Email đã tồn tại trong hệ thống");
            return "register";
        }
    }
}
