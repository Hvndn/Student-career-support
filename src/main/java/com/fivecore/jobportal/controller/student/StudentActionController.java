package com.fivecore.jobportal.controller.student;

import com.fivecore.jobportal.service.auth.ApplicationService;
import com.fivecore.jobportal.service.interaction.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fivecore.jobportal.service.student.SavedJobService;

/**
 * Bộ điều khiển Hành động Sinh viên (Sprint 4).
 * Quản lý US-007, US-008, US-019.
 */
@Controller
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentActionController {

    private final ApplicationService applicationService;
    private final NotificationService notificationService;
    private final SavedJobService savedJobService;
    private final com.fivecore.jobportal.repository.UserRepository userRepository;

    private Integer getCurrentStudentId(Authentication authentication) {
        if (authentication == null) return 1;
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getStudent() != null ? u.getStudent().getId() : 1)
                .orElse(1);
    }
    
    private Integer getCurrentUserId(Authentication authentication) {
        if (authentication == null) return 1;
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getId())
                .orElse(1);
    }

    /**
     * Nộp đơn ứng tuyển cho một công việc (US-007).
     */
    @PostMapping("/apply/{jobId}")
    public String applyJob(@PathVariable Integer jobId, Authentication authentication, RedirectAttributes redirectAttributes) {
        Integer studentId = getCurrentStudentId(authentication);
        try {
            applicationService.applyForJob(studentId, jobId);
            redirectAttributes.addFlashAttribute("successMessage", "Ứng tuyển thành công!");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/student/applications";
    }

    /**
     * Lưu tin tuyển dụng (US-015).
     */
    @PostMapping("/jobs/{jobId}/save")
    public String saveJob(@PathVariable Integer jobId, Authentication authentication, RedirectAttributes redirectAttributes) {
        Integer studentId = getCurrentStudentId(authentication);
        try {
            savedJobService.saveJob(studentId, jobId);
            redirectAttributes.addFlashAttribute("successMessage", "Đã lưu tin tuyển dụng!");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/student/jobs/saved";
    }
    
    /**
     * Xem danh sách tin đã lưu.
     */
    @GetMapping("/jobs/saved")
    public String viewSavedJobs(Model model, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        model.addAttribute("savedJobs", savedJobService.getSavedJobs(studentId));
        return "student/saved-jobs";
    }

    /**
     * Xem danh sách các công việc đã ứng tuyển (US-008).
     */
    @GetMapping("/applications")
    public String viewMyApplications(Model model, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        model.addAttribute("applications", applicationService.getApplicationsByStudent(studentId));
        return "student/applications";
    }

    /**
     * Xem trung tâm thông báo (US-019).
     */
    @GetMapping("/notifications")
    public String viewNotifications(Model model, Authentication authentication) {
        Integer userId = getCurrentUserId(authentication);
        model.addAttribute("notifications", notificationService.getNotificationsByUser(userId));
        return "student/notifications";
    }
}
