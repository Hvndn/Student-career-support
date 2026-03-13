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

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

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
    return "login_students";
}
    /**
     * Xử lý đăng nhập.
     */
    @PostMapping("/login")
    public String login(@Valid @ModelAttribute("loginRequest") LoginRequest request,
                        BindingResult result, Model model) {
        if (result.hasErrors()) {
            return "login_students";
        }

        boolean success = authService.login(request);
        
        if (success) {
            // Trong thực tế sẽ thiết lập session/cookie ở đây
            return "redirect:/dashboard";
        } else {
            model.addAttribute("error", "Email hoặc mật khẩu không chính xác");
            return "login_students";
        }
    }
  @GetMapping("/employer/login")
public String showEmployerLoginPage(Model model) {
    model.addAttribute("loginRequest", new LoginRequest());
    return "login_employer";
}
@PostMapping("/employer/login")
public String employerLogin(@Valid @ModelAttribute("loginRequest") LoginRequest request,
                            BindingResult result,
                            Model model) {

    if (result.hasErrors()) {
        return "login_employer";
    }

    boolean success = authService.login(request);

    if(success){
        return "redirect:/employer/dashboard";
    }

    model.addAttribute("error","Email hoặc mật khẩu không đúng");
    return "login_employer";
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
    @GetMapping("/students/register")
    public String registerStudent() {
        return "register_student";
    }
@GetMapping("/employer/register")
public String registerRecruiter(){
    return "register_employer";
}
@PostMapping("/employer/register")
public String registerEmployer(@Valid @ModelAttribute("registerRequest") RegisterRequest request,
                               BindingResult result,
                               Model model) {

    if (result.hasErrors()) {
        return "register_employer";
    }

    boolean success = authService.register(request);

    if (success) {
        model.addAttribute("message", "Đăng ký doanh nghiệp thành công! Vui lòng đăng nhập.");
        model.addAttribute("loginRequest", new LoginRequest());
        return "login_employer";
    } else {
        model.addAttribute("error", "Email đã tồn tại trong hệ thống");
        return "register_employer";
    }
}
@GetMapping("/forgot-password")
public String forgotPasswordPage() {
    return "forgot_password";
}

@PostMapping("/forgot-password")
public String handleForgotPassword(@RequestParam String email, Model model) {

    boolean exists = authService.checkEmailExists(email);

    if(!exists){
        model.addAttribute("error","Email không tồn tại trong hệ thống");
        return "forgot_password";
    }

    authService.sendResetPasswordEmail(email);

    model.addAttribute("message","Liên kết đặt lại mật khẩu đã được gửi tới email của bạn");
    return "forgot_password";
}
}
