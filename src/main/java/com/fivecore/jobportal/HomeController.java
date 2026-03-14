package com.fivecore.jobportal;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "dashboard";
    }

    // ================= STUDENT =================

    @GetMapping("/student/dashboard")
    public String studentDashboard(Model model) {
        model.addAttribute("user", "Diện");
        model.addAttribute("activePage", "dashboard");
        return "dashboard_student";
    }

    @GetMapping("/student/profile")
    public String profile(Model model) {
        model.addAttribute("user", "Nguyễn Văn A");
        model.addAttribute("activePage", "profile");
        return "profile";
    }

    @GetMapping("/student/jobs")
    public String studentJobs(Model model){
        model.addAttribute("activePage", "jobs");
        return "student_jobs";
    }


    // ================= EMPLOYER =================

    @GetMapping("/employer")
    public String employerHome(Model model) {
        model.addAttribute("activePage", "dashboard");
        return "dashboard_employer";
    }

    @GetMapping("/employer/dashboard")
    public String employerDashboard(Model model) {
        model.addAttribute("activePage", "dashboard");
        return "dashboard_employer";
    }

    @GetMapping("/employer/jobs")
    public String postJobPage(Model model){
        model.addAttribute("activePage", "jobs");
        return "employer_post_job";
    }

    @GetMapping("/employer/candidates")
    public String employerCandidates(Model model) {
        model.addAttribute("activePage", "candidates");
        return "employer_candidates";
    }

}