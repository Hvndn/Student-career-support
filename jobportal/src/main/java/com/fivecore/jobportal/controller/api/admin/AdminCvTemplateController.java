package com.fivecore.jobportal.controller.api.admin;

import com.fivecore.jobportal.entity.CvTemplate;
import com.fivecore.jobportal.service.admin.CvTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/cv-templates")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCvTemplateController {

    private final CvTemplateService cvTemplateService;
    private final JdbcTemplate jdbcTemplate;

    @GetMapping
    public ResponseEntity<?> getAllTemplates() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", cvTemplateService.getAllTemplates());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createTemplate(
            @RequestPart("template") CvTemplate template,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail) {
        CvTemplate saved = cvTemplateService.createTemplate(template, thumbnail);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã tạo mẫu CV mới thành công");
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTemplate(
            @PathVariable Integer id,
            @RequestPart("template") CvTemplate template,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail) {
        CvTemplate updated = cvTemplateService.updateTemplate(id, template, thumbnail);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cập nhật mẫu CV thành công");
        response.put("data", updated);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable Integer id) {
        cvTemplateService.deleteTemplate(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã xóa mẫu CV");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleStatus(@PathVariable Integer id) {
        CvTemplate updated = cvTemplateService.toggleStatus(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã cập nhật trạng thái mẫu CV");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cleanup-cv-tables")
    public ResponseEntity<?> cleanupTables() {
        try {
            // Drop related tables as requested
            // Drop related tables as requested
            jdbcTemplate.execute("DROP TABLE IF EXISTS experience");
            jdbcTemplate.execute("DROP TABLE IF EXISTS education");
            jdbcTemplate.execute("DROP TABLE IF EXISTS student_skills");
            jdbcTemplate.execute("DROP TABLE IF EXISTS languages");
            jdbcTemplate.execute("DROP TABLE IF EXISTS interests");
            jdbcTemplate.execute("DROP TABLE IF EXISTS activities");
            jdbcTemplate.execute("DROP TABLE IF EXISTS certifications");
            jdbcTemplate.execute("DROP TABLE IF EXISTS projects");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã xóa 8 bảng dữ liệu CV rườm rà thành công!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
