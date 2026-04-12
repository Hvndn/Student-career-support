package com.fivecore.jobportal.controller.api.student;

import com.fivecore.jobportal.dto.AiAnalysisDTO;
import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.student.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {

    private final AiService aiService;
    private final UserRepository userRepository;

    private Integer getCurrentStudentId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getStudent() != null ? u.getStudent().getId() : null)
                .orElse(null);
    }

    @GetMapping("/analyze-match/{jobId}")
    public ResponseEntity<ApiResponse<AiAnalysisDTO>> analyzeMatch(@PathVariable Integer jobId, Authentication authentication) {
        try {
            Integer studentId = getCurrentStudentId(authentication);
            if (studentId == null) {
                return ResponseEntity.status(401).body(ApiResponse.error("Không tìm thấy sinh viên", "UNAUTHORIZED"));
            }
            
            AiAnalysisDTO result = aiService.analyzeMatch(jobId, studentId);
            return ResponseEntity.ok(ApiResponse.success("Phân tích hồ sơ thành công", result));
        } catch (Exception e) {
            log.error("Lỗi khi phân tích AI: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Lỗi khi phân tích: " + e.getMessage(), "SERVER_ERROR"));
        }
    }
}
