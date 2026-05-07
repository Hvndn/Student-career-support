package com.fivecore.jobportal.controller.api.student;

import com.fivecore.jobportal.dto.*;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.auth.ProfileService;
import com.fivecore.jobportal.service.common.StorageService;
import com.fivecore.jobportal.service.interaction.PdfExportService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * REST API Controller cho Hồ sơ Sinh viên.
 * Quản lý thông tin cơ bản, học vấn và chứng chỉ.
 */
@RestController
@RequestMapping("/api/student/profile")
@RequiredArgsConstructor
@Slf4j
public class StudentProfileRestController {

    private final ProfileService profileService;
    private final PdfExportService pdfExportService;
    private final StorageService storageService;
    private final UserRepository userRepository;
    private final StudentProfileMapper studentProfileMapper;

    private Integer getCurrentStudentId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getStudent() != null ? u.getStudent().getId() : null)
                .orElse(null);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null || user.getStudent() == null) {
            return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy sinh viên", "NOT_FOUND"));
        }
        Student student = user.getStudent();
        StudentProfileResponse response = studentProfileMapper.toResponse(user, student);
        return ResponseEntity.ok(ApiResponse.success("Lấy hồ sơ thành công", response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Object>> updateProfile(@RequestBody StudentProfileRequest request,
            Authentication authentication) {
        try {
            Integer studentId = getCurrentStudentId(authentication);
            if (studentId == null) {
                return ResponseEntity.status(401).body(ApiResponse.error("Không tìm thấy sinh viên", "UNAUTHORIZED"));
            }
            profileService.updateProfile(studentId, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin thành công", null));
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật hồ sơ: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Lỗi khi cập nhật hồ sơ: " + e.getMessage(), "SERVER_ERROR"));
        }
    }

    /* ---- Avatar ---- */
    @PostMapping("/avatar")
    public ResponseEntity<ApiResponse<String>> updateAvatar(@RequestParam("avatarFile") MultipartFile avatarFile,
            Authentication authentication) {
        try {
            Integer studentId = getCurrentStudentId(authentication);
            if (avatarFile == null || avatarFile.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng chọn ảnh", "INVALID_FILE"));
            }
            String avatarUrl = storageService.saveAvatar(avatarFile);
            profileService.updateAvatar(studentId, avatarUrl);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật ảnh đại diện thành công", avatarUrl));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "UPLOAD_ERROR"));
        } catch (Exception e) {
            log.error("Lỗi không xác định khi upload avatar: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi hệ thống", "SERVER_ERROR"));
        }
    }


    @PostMapping("/resume/upload")
    public ResponseEntity<ApiResponse<String>> updateResume(@RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            Integer studentId = getCurrentStudentId(authentication);
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng chọn file CV", "INVALID_FILE"));
            }
            String resumeUrl = storageService.saveFile(file, "resumes");
            profileService.updateResumeUrl(studentId, resumeUrl);
            return ResponseEntity.ok(ApiResponse.success("Đính kèm CV thành công", resumeUrl));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "UPLOAD_ERROR"));
        } catch (Exception e) {
            log.error("Lỗi không xác định khi upload CV: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi hệ thống", "SERVER_ERROR"));
        }
    }

    /* ---- Export PDF ---- */
    @GetMapping("/export-pdf")
    public void exportToPdf(HttpServletResponse response, Authentication authentication) throws Exception {
        Integer studentId = getCurrentStudentId(authentication);
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=profile.pdf");
        pdfExportService.exportProfileToPdf(studentId, response);
    }


    /* ---- Skills (via cvData JSON) ---- */
    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<Object>> addSkill(@RequestBody Map<String, Object> body, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        String skillName = (String) body.get("skillName");
        String level = (String) body.get("level");
        profileService.addSkill(studentId, skillName, level);
        return ResponseEntity.ok(ApiResponse.success("Thêm kỹ năng thành công", null));
    }

    @DeleteMapping("/skills/{name}")
    public ResponseEntity<ApiResponse<Object>> deleteSkill(@PathVariable String name, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.deleteSkill(studentId, name);
        return ResponseEntity.ok(ApiResponse.success("Xóa kỹ năng thành công", null));
    }

    /* ---- Projects ---- */
    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<Object>> addProject(@RequestBody com.fivecore.jobportal.entity.Project project, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.addProject(studentId, project);
        return ResponseEntity.ok(ApiResponse.success("Thêm dự án thành công", null));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteProject(@PathVariable Integer id, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.deleteProject(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Xóa dự án thành công", null));
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Object>> updateProject(@PathVariable Integer id, 
            @RequestBody com.fivecore.jobportal.entity.Project project, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.updateProject(id, studentId, project);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật dự án thành công", null));
    }
}
