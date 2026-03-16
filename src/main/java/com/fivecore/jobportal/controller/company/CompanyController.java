package com.fivecore.jobportal.controller.company;

import com.fivecore.jobportal.dto.JobRequest;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.service.company.CompanyService;
import com.fivecore.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;

/**
 * Bộ điều khiển Doanh nghiệp (Sprint 3).
 * Quản lý các endpoint cho US-005, US-013.
 */
@Controller
@RequestMapping("/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    private final UserRepository userRepository;
    private final com.fivecore.jobportal.repository.JobRepository jobRepository;
    private final com.fivecore.jobportal.repository.ApplicationRepository applicationRepository;

    private Integer getCurrentCompanyId(Authentication authentication) {
        if (authentication == null) return 1;
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getCompany() != null ? u.getCompany().getId() : 1)
                .orElse(1);
    }

    /**
     * Hiển thị Dashboard của doanh nghiệp.
     */
    @GetMapping("/dashboard")
    public String showDashboard(Model model, Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        String email = authentication.getName();
        
        userRepository.findByEmail(email).ifPresent(user -> {
            model.addAttribute("fullName", user.getFullName());
            if (user.getCompany() != null) {
                model.addAttribute("companyName", user.getCompany().getName());
            }
        });

        model.addAttribute("jobs", companyService.getJobsByCompany(companyId));
        model.addAttribute("jobCount", jobRepository.countByCompanyId(companyId));
        model.addAttribute("applicationCount", applicationRepository.countByJobCompanyId(companyId));
        
        return "company/dashboard";
    }

    /**
     * Trang đăng tin tuyển dụng mới.
     */
    @GetMapping("/jobs/post")
    public String showPostJobPage(Model model) {
        if (!model.containsAttribute("job")) {
            model.addAttribute("job", new JobRequest());
        }
        return "company/post-job";
    }

    /**
     * Xử lý đăng tin tuyển dụng (US-005).
     */
    @PostMapping("/jobs/post")
    public String processPostJob(@Valid @ModelAttribute("job") JobRequest jobRequest, BindingResult result, Authentication authentication, Model model) {
        if (result.hasErrors()) {
            return "company/post-job";
        }
        Integer companyId = getCurrentCompanyId(authentication);
        companyService.postJob(companyId, jobRequest);
        return "redirect:/company/dashboard";
    }

    /**
     * Hiển thị trang hồ sơ doanh nghiệp.
     */
    @GetMapping("/profile")
    public String showProfile(Model model, Authentication authentication) {
        String email = authentication.getName();
        Company company = companyService.getCompanyByUserEmail(email);
        model.addAttribute("company", company);
        return "company/profile";
    }

    /**
     * Cập nhật thông tin công ty (US-013).
     */
    @PostMapping("/profile/update")
    public String updateProfile(@ModelAttribute Company company, 
                               @RequestParam(value = "logoFile", required = false) MultipartFile logoFile,
                               Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        companyService.updateCompanyInfo(companyId, company, logoFile);
        return "redirect:/company/profile?success";
    }
}
