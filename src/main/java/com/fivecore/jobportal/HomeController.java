package com.fivecore.jobportal;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
@Controller
public class HomeController {

    // Trang chủ = trang tìm việc
    @GetMapping("/")
    public String home() {
        return "dashboard";
    }

    // Trang login
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // Dashboard sinh viên sau khi đăng nhập
    @GetMapping("/student/dashboard")
    public String studentDashboard(Model model) {

        model.addAttribute("user", "Diện");

        return "dashboard_student";
    }

}
