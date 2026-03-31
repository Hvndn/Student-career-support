package com.fivecore.jobportal.controller.admin;

import com.fivecore.jobportal.service.admin.AdminService;
import com.fivecore.jobportal.service.auth.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * Bộ điều khiển Quản trị (Sprint 5).
 * Quản lý US-010.
 */
@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final SkillService skillService;
    private final AdminService adminService;

    /**
     * Dashboard Admin: Thống kê hệ thống.
     */
    @GetMapping("/dashboard")
    public String showDashboard(Model model) {
        model.addAttribute("stats", adminService.getSystemStatistics());
        model.addAttribute("pendingCompanies", adminService.getPendingCompanies());
        model.addAttribute("skills", skillService.getAllSkills());
        model.addAttribute("users", adminService.getAllUsers());
        return "admin/dashboard";
    }

    /**
     * Phê duyệt doanh nghiệp tức thì (US-010).
     */
    @PostMapping("/companies/{id}/approve")
    public String approveCompany(@PathVariable Integer id) {
        // ID này giả định là User_id
        adminService.toggleUserLock(id, false); // Mở khóa
        return "redirect:/admin/dashboard";
    }

    /**
     * Cập nhật Kỹ năng Master Data (US-014).
     */
    @PostMapping("/skills/{id}/update")
    public String updateSkill(@PathVariable Integer id, @RequestParam("name") String name, 
                               @RequestParam("category") String category) {
        skillService.updateSkill(id, name, category);
        return "redirect:/admin/dashboard";
    }

    /**
     * Xóa Kỹ năng Master Data (US-014).
     */
    @PostMapping("/skills/{id}/delete")
    public String deleteSkill(@PathVariable Integer id) {
        skillService.deleteSkill(id);
        return "redirect:/admin/dashboard";
    }

    /**
     * Thêm kỹ năng mới vào danh mục hệ thống (US-010).
     */
    @PostMapping("/skills/create")
    public String createSkill(@RequestParam("name") String name, 
                               @RequestParam("category") String category) {
        skillService.createNewSkill(name, category);
        return "redirect:/admin/dashboard";
    }

    /**
     * Khóa/Mở khóa người dùng.
     */
    @PostMapping("/users/{id}/toggle-lock")
    public String toggleUserLock(@PathVariable Integer id, @RequestParam("lock") boolean lock) {
        adminService.toggleUserLock(id, lock);
        return "redirect:/admin/dashboard";
    }
}
