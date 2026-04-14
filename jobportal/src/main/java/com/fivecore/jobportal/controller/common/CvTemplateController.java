package com.fivecore.jobportal.controller.common;

import com.fivecore.jobportal.service.admin.CvTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cv-templates")
@RequiredArgsConstructor
public class CvTemplateController {

    private final CvTemplateService cvTemplateService;

    @GetMapping
    public ResponseEntity<?> getActiveTemplates(@RequestParam(required = false) String category) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        
        if (category != null && !category.isEmpty() && !category.equals("Tất cả")) {
            response.put("data", cvTemplateService.getTemplatesByCategory(category));
        } else {
            response.put("data", cvTemplateService.getActiveTemplates());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTemplateDetail(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", cvTemplateService.getTemplateById(id));
        return ResponseEntity.ok(response);
    }
}
