package com.fivecore.jobportal.controller.api;

import com.fivecore.jobportal.dto.*;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.auth.ProfileService;
import com.fivecore.jobportal.service.auth.ProjectService;
import com.fivecore.jobportal.service.auth.SkillService;
import com.fivecore.jobportal.service.common.StorageService;
import com.fivecore.jobportal.service.interaction.PdfExportService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST API Controller cho Hồ sơ Sinh viên.
 */
@RestController
@RequestMapping("/api/student/profile")
@RequiredArgsConstructor
public class StudentProfileRestController {

    private final SkillService skillService;
    private final ProjectService projectService;
    private final ProfileService profileService;
    private final PdfExportService pdfExportService;
    private final StorageService storageService;
    private final UserRepository userRepository;

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
        StudentProfileResponse response = StudentProfileResponse.builder()
                .id(student.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .studentCode(student.getStudentCode())
                .university(student.getUniversity())
                .major(student.getMajor())
                .graduationYear(student.getGraduationYear())
                .bio(student.getBio())
                .avatarUrl(student.getAvatarUrl())
                .skills(student.getSkills().stream().map((StudentSkill s) -> StudentProfileResponse.SkillDto.builder()
                        .id(s.getSkill().getId())
                        .name(s.getSkill().getName())
                        .level(s.getLevel().name())
                        .build()).collect(Collectors.toList()))
                .educations(student.getEducations().stream().map((Education e) -> StudentProfileResponse.EducationDto.builder()
                        .id(e.getId())
                        .schoolName(e.getSchoolName())
                        .major(e.getMajor())
                        .degree(e.getDegree())
                        .startDate(e.getStartDate())
                        .endDate(e.getEndDate())
                        .description(e.getDescription())
                        .build()).collect(Collectors.toList()))
                .experiences(student.getExperiences().stream().map((Experience exp) -> StudentProfileResponse.ExperienceDto.builder()
                        .id(exp.getId())
                        .companyName(exp.getCompanyName())
                        .jobTitle(exp.getJobTitle())
                        .startDate(exp.getStartDate())
                        .endDate(exp.getEndDate())
                        .description(exp.getDescription())
                        .build()).collect(Collectors.toList()))
                .projects(projectService.getProjectsByStudent(student.getId()).stream().map((Project p) -> StudentProfileResponse.ProjectDto.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .description(p.getDescription())
                        .repositoryUrl(p.getRepositoryUrl())
                        .demoUrl(p.getDemoUrl())
                        .build()).collect(Collectors.toList()))
                .build();

        return ResponseEntity.ok(ApiResponse.success("Lấy hồ sơ thành công", response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Object>> updateProfile(@RequestBody StudentProfileRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.updateProfile(studentId, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin thành công", null));
    }

    /* ---- Education ---- */
    @PostMapping("/educations")
    public ResponseEntity<ApiResponse<Object>> addEducation(@RequestBody EducationRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.addEducation(studentId, Education.builder()
                .schoolName(request.getSchoolName())
                .major(request.getMajor())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .build());
        return ResponseEntity.ok(ApiResponse.success("Thêm học vấn thành công", null));
    }

    @PutMapping("/educations/{id}")
    public ResponseEntity<ApiResponse<Object>> updateEducation(@PathVariable Integer id, @RequestBody EducationRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.updateEducation(id, studentId, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật học vấn thành công", null));
    }

    @DeleteMapping("/educations/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteEducation(@PathVariable Integer id, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.deleteEducation(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Xóa học vấn thành công", null));
    }

    /* ---- Experience ---- */
    @PostMapping("/experiences")
    public ResponseEntity<ApiResponse<Object>> addExperience(@RequestBody ExperienceRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.addExperience(studentId, Experience.builder()
                .companyName(request.getCompanyName())
                .jobTitle(request.getJobTitle())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .build());
        return ResponseEntity.ok(ApiResponse.success("Thêm kinh nghiệm thành công", null));
    }

    @PutMapping("/experiences/{id}")
    public ResponseEntity<ApiResponse<Object>> updateExperience(@PathVariable Integer id, @RequestBody ExperienceRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.updateExperience(id, studentId, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật kinh nghiệm thành công", null));
    }

    @DeleteMapping("/experiences/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteExperience(@PathVariable Integer id, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        profileService.deleteExperience(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Xóa kinh nghiệm thành công", null));
    }

    /* ---- Skills ---- */
    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<Object>> addSkill(@RequestBody SkillAddRequest request,
                                                       Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        skillService.addSkillToStudent(studentId, request.getSkillId(), StudentSkill.SkillLevel.valueOf(request.getLevel().toUpperCase()));
        return ResponseEntity.ok(ApiResponse.success("Thêm kỹ năng thành công", null));
    }

    @DeleteMapping("/skills/{skillId}")
    public ResponseEntity<ApiResponse<Object>> deleteSkill(@PathVariable Integer skillId, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        skillService.removeSkillFromStudent(studentId, skillId);
        return ResponseEntity.ok(ApiResponse.success("Xóa kỹ năng thành công", null));
    }

    @PostMapping("/avatar")
    public ResponseEntity<ApiResponse<String>> updateAvatar(@RequestParam("avatarFile") MultipartFile avatarFile,
                                                           Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        if (avatarFile != null && !avatarFile.isEmpty()) {
            String avatarUrl = storageService.saveAvatar(avatarFile);
            profileService.updateAvatar(studentId, avatarUrl);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật ảnh đại diện thành công", avatarUrl));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng chọn ảnh", "INVALID_FILE"));
    }

    @GetMapping("/export-pdf")
    public void exportToPdf(HttpServletResponse response, Authentication authentication) throws Exception {
        Integer studentId = getCurrentStudentId(authentication);
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=profile.pdf");
        pdfExportService.exportProfileToPdf(studentId, response);
    }
}
