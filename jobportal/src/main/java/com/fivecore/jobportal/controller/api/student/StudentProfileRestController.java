package com.fivecore.jobportal.controller.api.student;

import com.fivecore.jobportal.dto.*;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.auth.CertificationService;
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
    private final CertificationService certificationService;
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

    /* ---- Education ---- */
    @PostMapping("/educations")
    public ResponseEntity<ApiResponse<Object>> addEducation(@Valid @RequestBody EducationRequest request,
            Authentication authentication) {
        try {
            Integer studentId = getCurrentStudentId(authentication);
            if (studentId == null) {
                return ResponseEntity.status(401).body(ApiResponse.error("Không tìm thấy sinh viên", "UNAUTHORIZED"));
            }
            profileService.addEducation(studentId, Education.builder()
                    .schoolName(request.getSchoolName())
                    .major(request.getMajor())
                    .startDate(request.getStartDate())
                    .endDate(request.getEndDate())
                    .description(request.getDescription())
                    .build());
            return ResponseEntity.ok(ApiResponse.success("Thêm học vấn thành công", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage(), "BAD_REQUEST"));
        } catch (Exception e) {
            log.error("Lỗi khi thêm học vấn: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi thêm học vấn: " + e.getMessage(), "SERVER_ERROR"));
        }
    }

    @PutMapping("/educations/{id}")
    public ResponseEntity<ApiResponse<Object>> updateEducation(@PathVariable Integer id,
            @Valid @RequestBody EducationRequest request, Authentication authentication) {
        try {
            Integer studentId = getCurrentStudentId(authentication);
            profileService.updateEducation(id, studentId, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật học vấn thành công", null));
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật học vấn: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi cập nhật học vấn: " + e.getMessage(), "SERVER_ERROR"));
        }
    }

    @DeleteMapping("/educations/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteEducation(@PathVariable Integer id,
            Authentication authentication) {
        try {
            Integer studentId = getCurrentStudentId(authentication);
            profileService.deleteEducation(id, studentId);
            return ResponseEntity.ok(ApiResponse.success("Xóa học vấn thành công", null));
        } catch (Exception e) {
            log.error("Lỗi khi xóa học vấn: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi xóa học vấn: " + e.getMessage(), "SERVER_ERROR"));
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

    @PostMapping("/video")
    public ResponseEntity<ApiResponse<String>> updateVideo(@RequestParam("videoFile") MultipartFile videoFile,
            Authentication authentication) {
        try {
            Integer studentId = getCurrentStudentId(authentication);
            if (videoFile == null || videoFile.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng chọn video", "INVALID_FILE"));
            }
            String videoUrl = storageService.saveFile(videoFile, "videos");
            profileService.updateVideo(studentId, videoUrl);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật video giới thiệu thành công", videoUrl));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "UPLOAD_ERROR"));
        } catch (Exception e) {
            log.error("Lỗi không xác định khi upload video: {}", e.getMessage(), e);
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

    /* ---- Certifications ---- */
    @PostMapping("/certifications")
    public ResponseEntity<ApiResponse<Object>> addCertification(@RequestBody CertificationRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        certificationService.addCertification(studentId, Certification.builder()
                .name(request.getName())
                .issuer(request.getIssuer())
                .issueDate(request.getIssueDate())
                .expirationDate(request.getExpirationDate())
                .certificateUrl(request.getCertificateUrl())
                .build());
        return ResponseEntity.ok(ApiResponse.success("Thêm chứng chỉ thành công", null));
    }

    @PutMapping("/certifications/{id}")
    public ResponseEntity<ApiResponse<Object>> updateCertification(@PathVariable Integer id, @RequestBody CertificationRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        certificationService.updateCertification(id, studentId, Certification.builder()
                .name(request.getName())
                .issuer(request.getIssuer())
                .issueDate(request.getIssueDate())
                .expirationDate(request.getExpirationDate())
                .certificateUrl(request.getCertificateUrl())
                .build());
        return ResponseEntity.ok(ApiResponse.success("Cập nhật chứng chỉ thành công", null));
    }

    @DeleteMapping("/certifications/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteCertification(@PathVariable Integer id, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        certificationService.deleteCertification(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Xóa chứng chỉ thành công", null));
    }

    /* ---- Skills (via cvData JSON) ---- */
    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<Object>> addSkill(@RequestBody Map<String, Object> body, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        Integer skillId = (Integer) body.get("skillId");
        String level = (String) body.get("level");
        profileService.addSkill(studentId, skillId, level);
        return ResponseEntity.ok(ApiResponse.success("Thêm kỹ năng thành công", null));
    }

    @DeleteMapping("/skills/{name}")
    public ResponseEntity<ApiResponse<Object>> deleteSkill(@PathVariable String name, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.deleteSkill(studentId, name);
        return ResponseEntity.ok(ApiResponse.success("Xóa kỹ năng thành công", null));
    }
}
