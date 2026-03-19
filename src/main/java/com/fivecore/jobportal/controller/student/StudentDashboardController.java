package com.fivecore.jobportal.controller.student;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.ui.Model;
import org.springframework.security.core.Authentication;

@Controller
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentDashboardController {

    private final com.fivecore.jobportal.repository.UserRepository userRepository;
    private final com.fivecore.jobportal.service.auth.SkillService skillService;
    private final com.fivecore.jobportal.service.auth.ProjectService projectService;
    private final com.fivecore.jobportal.service.auth.ApplicationService applicationService;

    private Integer getCurrentStudentId(Authentication authentication) {
        if (authentication == null) return 1;
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getStudent() != null ? u.getStudent().getId() : 1)
                .orElse(1);
    }

    @GetMapping("/dashboard")
    public String showDashboard(Model model, Authentication authentication) {
        if (authentication != null) {
            String email = authentication.getName();
            model.addAttribute("username", email);
            
            Integer studentId = getCurrentStudentId(authentication);
            
            // Lấy thông tin User để hiển thị tên thật
            userRepository.findByEmail(email).ifPresent(user -> {
                model.addAttribute("fullName", user.getFullName());
            });

            // Thống kê sơ bộ
            model.addAttribute("skillCount", skillService.getAllSkills().size()); 
            model.addAttribute("projectCount", projectService.getProjectsByStudent(studentId).size());
            model.addAttribute("applicationCount", applicationService.getApplicationsByStudent(studentId).size());
        }
        return "student/dashboard";
    }
}
