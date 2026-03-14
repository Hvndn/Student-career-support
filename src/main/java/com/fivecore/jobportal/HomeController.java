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

    @GetMapping("/student/dashboard")
    public String studentDashboard(Model model) {
        model.addAttribute("user", "Diện");
        return "dashboard_student";
    }

    @GetMapping("/employer")
    public String employerHome() {
        return "dashboard_employer";
    }

    @GetMapping("/employer/landing")
    public String employerLanding() {
        return "employer_landing";
    }


    @GetMapping("student/profile")
    public String profile(Model model) {

        model.addAttribute("user","Nguyễn Văn A");
            model.addAttribute("activePage", "profile");


        return "profile";
    }
    @GetMapping("/dashboard")
public String dashboard(Model model) {
    model.addAttribute("activePage", "dashboard");
    return "dashboard";
}
@GetMapping("/student/jobs")
public String studentJobs(){
    return "student_jobs";
}
@GetMapping("/student/projects")
public String studentProjects() {
    return "student_projects";
}
@GetMapping("/student/skills")
public String studentSkills(){
    return "student_skills";
}
}