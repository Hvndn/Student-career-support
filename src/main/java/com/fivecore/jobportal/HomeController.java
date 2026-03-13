package com.fivecore.jobportal;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index";
    }


    @GetMapping("/dashboard")
    public String dashboard(Model model) {

        // Demo dữ liệu user (sau này lấy từ DB)
        model.addAttribute("user", "Diện");

        return "dashboard";
    }


    @GetMapping("/login")
    public String login() {
        return "login";
    }
    @GetMapping("/jobs")
public String jobs() {
    return "jobs";
}
}
