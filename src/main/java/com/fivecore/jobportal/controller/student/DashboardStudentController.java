package com.fivecore.jobportal.controller.student;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Điều khiển các trang chính của ứng dụng dành cho sinh viên.
 */
@Controller
public class DashboardStudentController {

    @GetMapping({"/", "/index"})
    public String home(Model model) {
        model.addAttribute("username", "Khách");
        return "index";
    }

    @GetMapping("/dashboard")
    public String dashboard(@RequestParam(value = "role", required = false) String role, Model model) {
        // Trong thực tế sẽ lấy từ UserDetails (Spring Security)
        // Hiện tại dùng tham số role để bạn có thể test nhanh cả hai giao diện
        
        if ("company".equalsIgnoreCase(role)) {
            model.addAttribute("user", "Công ty Công nghệ ABC");
            return "dashboard-company";
        }
        
        model.addAttribute("user", "Nguyễn Văn A");
        return "dashboard";
    }
}
