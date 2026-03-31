package com.fivecore.jobportal.controller.student;

import com.fivecore.jobportal.entity.Project;
import com.fivecore.jobportal.entity.StudentSkill;
import com.fivecore.jobportal.service.auth.ProjectService;
import com.fivecore.jobportal.service.auth.SkillService;
import com.fivecore.jobportal.service.auth.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletResponse;
import com.fivecore.jobportal.service.common.StorageService;

import com.fivecore.jobportal.entity.Education;
import com.fivecore.jobportal.entity.Experience;
import com.fivecore.jobportal.service.interaction.PdfExportService;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Bộ điều khiển Hồ sơ Sinh viên (Sprint 2).
 * Quản lý các endpoint cho US-003, US-004, US-011.
 */
@Controller
@RequestMapping("/student/profile")
@RequiredArgsConstructor
public class StudentProfileController {

    private final SkillService skillService;
    private final ProjectService projectService;
    private final ProfileService profileService;
    private final PdfExportService pdfExportService;
    private final StorageService storageService;
    private final com.fivecore.jobportal.repository.UserRepository userRepository;

    private Integer getCurrentStudentId(Authentication authentication) {
        if (authentication == null) return 1;
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getStudent() != null ? u.getStudent().getId() : 1)
                .orElse(1);
    }

    /**
     * Hiển thị trang chỉnh sửa hồ sơ.
     */
    @GetMapping
    public String showProfilePage(Model model, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        com.fivecore.jobportal.entity.Student student = userRepository.findByEmail(authentication.getName())
                .map(u -> u.getStudent())
                .orElse(null);
        
        model.addAttribute("student", student);
        model.addAttribute("skills", skillService.getAllSkills());
        model.addAttribute("myProjects", projectService.getProjectsByStudent(studentId));
        model.addAttribute("educations", profileService.getEducations(studentId));
        model.addAttribute("experiences", profileService.getExperiences(studentId));
        return "student/profile";
    }

    /**
     * Thêm kỹ năng mới (US-003).
     */
    @PostMapping("/skills/add")
    public String addSkill(@RequestParam("skillId") Integer skillId, 
                           @RequestParam("level") String level, Authentication authentication,
                           RedirectAttributes redirectAttributes) {
        Integer studentId = getCurrentStudentId(authentication);
        try {
            skillService.addSkillToStudent(studentId, skillId, StudentSkill.SkillLevel.valueOf(level.toLowerCase()));
            redirectAttributes.addFlashAttribute("successMessage", "Thêm kỹ năng thành công");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/student/profile";
    }

    @GetMapping("/skills/delete/{skillId}")
    public String deleteSkill(@PathVariable Integer skillId, Authentication authentication,
                              RedirectAttributes redirectAttributes) {
        Integer studentId = getCurrentStudentId(authentication);
        skillService.removeSkillFromStudent(studentId, skillId);
        redirectAttributes.addFlashAttribute("successMessage", "Xóa kỹ năng thành công");
        return "redirect:/student/profile";
    }

    /**
     * Thêm dự án mới (US-004).
     */
    @PostMapping("/projects/add")
    public String addProject(@ModelAttribute Project project, Authentication authentication,
                             RedirectAttributes redirectAttributes) {
        Integer studentId = getCurrentStudentId(authentication);
        try {
            projectService.addProject(studentId, project);
            redirectAttributes.addFlashAttribute("successMessage", "Thêm dự án thành công");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/student/profile";
    }

    @GetMapping("/projects/delete/{id}")
    public String deleteProject(@PathVariable Integer id, Authentication authentication,
                                RedirectAttributes redirectAttributes) {
        Integer studentId = getCurrentStudentId(authentication);
        projectService.deleteProject(id, studentId);
        redirectAttributes.addFlashAttribute("successMessage", "Xóa dự án thành công");
        return "redirect:/student/profile";
    }

    /**
     * Cập nhật học vấn nhanh.
     */
    @PostMapping("/education/update")
    public String updateEducation(@RequestParam("university") String university,
                                  @RequestParam("major") String major,
                                  @RequestParam("gradYear") Integer gradYear,
                                  @RequestParam(value = "avatarUrl", required = false) String avatarUrl,
                                  Authentication authentication,
                                  RedirectAttributes redirectAttributes) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.updateEducation(studentId, university, major, gradYear, avatarUrl);
        redirectAttributes.addFlashAttribute("successMessage", "Cập nhật hồ sơ thành công");
        return "redirect:/student/profile";
    }

    /**
     * Cập nhật riêng ảnh đại diện.
     */
    @PostMapping("/avatar/update")
    public String updateAvatar(@RequestParam("avatarFile") MultipartFile avatarFile,
                               Authentication authentication,
                               RedirectAttributes redirectAttributes) {
        Integer studentId = getCurrentStudentId(authentication);
        
        if (avatarFile != null && !avatarFile.isEmpty()) {
            String avatarUrl = storageService.saveAvatar(avatarFile);
            profileService.updateAvatar(studentId, avatarUrl);
            redirectAttributes.addFlashAttribute("successMessage", "Cập nhật ảnh đại diện thành công");
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Vui lòng chọn một tập tin ảnh");
        }
        
        return "redirect:/student/profile";
    }

    @GetMapping("/education/delete/{id}")
    public String deleteEducation(@PathVariable Integer id, Authentication authentication,
                                  RedirectAttributes redirectAttributes) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.deleteEducation(id, studentId);
        redirectAttributes.addFlashAttribute("successMessage", "Xóa thông tin học vấn thành công");
        return "redirect:/student/profile";
    }

    /**
     * Thêm học vấn chi tiết (US-011).
     */
    @PostMapping("/education/add")
    public String addEducation(@ModelAttribute Education education, Authentication authentication,
                               RedirectAttributes redirectAttributes) {
        Integer studentId = getCurrentStudentId(authentication);
        try {
            profileService.addEducation(studentId, education);
            redirectAttributes.addFlashAttribute("successMessage", "Thêm học vấn thành công");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/student/profile";
    }

    @GetMapping("/experience/delete/{id}")
    public String deleteExperience(@PathVariable Integer id, Authentication authentication,
                                   RedirectAttributes redirectAttributes) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.deleteExperience(id, studentId);
        redirectAttributes.addFlashAttribute("successMessage", "Xóa kinh nghiệm thành công");
        return "redirect:/student/profile";
    }

    /**
     * Thêm Kinh nghiệm (US-011).
     */
    @PostMapping("/experience/add")
    public String addExperience(@ModelAttribute Experience experience, Authentication authentication,
                                RedirectAttributes redirectAttributes) {
        Integer studentId = getCurrentStudentId(authentication);
        try {
            profileService.addExperience(studentId, experience);
            redirectAttributes.addFlashAttribute("successMessage", "Thêm kinh nghiệm thành công");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/student/profile";
    }

    /**
     * Xuất hồ sơ năng lực ra PDF (US-012).
     */
    @GetMapping("/export-pdf")
    public void exportToPdf(HttpServletResponse response, Authentication authentication) throws IOException {
        response.setContentType("application/pdf");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=profile_" + currentDateTime + ".pdf";
        response.setHeader(headerKey, headerValue);

        Integer studentId = getCurrentStudentId(authentication);
        try {
            pdfExportService.exportProfileToPdf(studentId, response);
        } catch (IllegalArgumentException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Lỗi server khi tạo PDF");
        }
    }
}
