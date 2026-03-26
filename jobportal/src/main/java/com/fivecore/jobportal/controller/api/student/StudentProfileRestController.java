package com.fivecore.jobportal.controller.api.student;

import com.fivecore.jobportal.dto.*;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.auth.ActivityService;
import com.fivecore.jobportal.service.auth.InterestService;
import com.fivecore.jobportal.service.auth.LanguageService;
import com.fivecore.jobportal.service.auth.ProfileService;
import com.fivecore.jobportal.service.auth.ProjectService;
import com.fivecore.jobportal.service.auth.SkillService;
import com.fivecore.jobportal.service.auth.CertificationService;
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

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST API Controller cho Hồ sơ Sinh viên.
 */
@RestController
@RequestMapping("/api/student/profile")
@RequiredArgsConstructor
@Slf4j
public class StudentProfileRestController {

    private final SkillService skillService;
    private final ProjectService projectService;
    private final ProfileService profileService;
    private final PdfExportService pdfExportService;
    private final StorageService storageService;
    private final UserRepository userRepository;
    private final LanguageService languageService;
    private final InterestService interestService;
    private final ActivityService activityService;
    private final CertificationService certificationService;

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
                .gpa(student.getGpa())
                .totalCredits(student.getTotalCredits())
                .earnedCredits(student.getEarnedCredits())
                .classRank(student.getClassRank())
                .academicYear(student.getAcademicYear())
                .currentTerm(student.getCurrentTerm())
                .bio(student.getBio())
                .phone(student.getPhone())
                .address(student.getAddress())
                .avatarUrl(student.getAvatarUrl())
                .skills(student.getSkills() == null ? List.of() : student.getSkills().stream().map((StudentSkill s) -> StudentProfileResponse.SkillDto.builder()
                        .id(s.getSkill().getId())
                        .name(s.getSkill().getName())
                        .level(s.getLevel() == null ? null : s.getLevel().name())
                        .build()).collect(Collectors.toList()))
                .educations(student.getEducations() == null ? List.of() : student.getEducations().stream().map((Education e) -> StudentProfileResponse.EducationDto.builder()
                        .id(e.getId())
                        .schoolName(e.getSchoolName())
                        .major(e.getMajor())
                        .degree(e.getDegree())
                        .startDate(e.getStartDate())
                        .endDate(e.getEndDate())
                        .description(e.getDescription())
                        .build()).collect(Collectors.toList()))
                .experiences(student.getExperiences() == null ? List.of() : student.getExperiences().stream().map((Experience exp) -> StudentProfileResponse.ExperienceDto.builder()
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
                        .techStack(p.getTechStack())
                        .role(p.getRole())
                        .build()).collect(Collectors.toList()))
                .languages(student.getLanguages() == null ? List.of() : student.getLanguages().stream().map((Language l) -> StudentProfileResponse.LanguageDto.builder()
                        .id(l.getId())
                        .languageName(l.getLanguageName())
                        .proficiency(l.getProficiency())
                        .certificate(l.getCertificate())
                        .build()).collect(Collectors.toList()))
                .interests(student.getInterests() == null ? List.of() : student.getInterests().stream().map((Interest i) -> StudentProfileResponse.InterestDto.builder()
                        .id(i.getId())
                        .name(i.getName())
                        .build()).collect(Collectors.toList()))
                .activities(student.getActivities() == null ? List.of() : student.getActivities().stream().map((Activity a) -> StudentProfileResponse.ActivityDto.builder()
                        .id(a.getId())
                        .name(a.getName())
                        .organization(a.getOrganization())
                        .role(a.getRole())
                        .startDate(a.getStartDate() != null ? a.getStartDate().toString() : null)
                        .endDate(a.getEndDate() != null ? a.getEndDate().toString() : null)
                        .description(a.getDescription())
                        .build()).collect(Collectors.toList()))
                .certifications(student.getCertifications() == null ? List.of() : student.getCertifications().stream().map((Certification c) -> StudentProfileResponse.CertificationDto.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .issuer(c.getIssuer())
                        .issueDate(c.getIssueDate() != null ? c.getIssueDate().toString() : null)
                        .expirationDate(c.getExpirationDate() != null ? c.getExpirationDate().toString() : null)
                        .certificateUrl(c.getCertificateUrl())
                        .build()).collect(Collectors.toList()))
                .build();

        return ResponseEntity.ok(ApiResponse.success("Lấy hồ sơ thành công", response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Object>> updateProfile(@RequestBody StudentProfileRequest request, Authentication authentication) {
        try {
            Integer studentId = getCurrentStudentId(authentication);
            if (studentId == null) {
                return ResponseEntity.status(401).body(ApiResponse.error("Không tìm thấy sinh viên", "UNAUTHORIZED"));
            }
            profileService.updateProfile(studentId, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin thành công", null));
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật hồ sơ: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi cập nhật hồ sơ: " + e.getMessage(), "SERVER_ERROR"));
        }
    }

    /* ---- Education ---- */
    @PostMapping("/educations")
    public ResponseEntity<ApiResponse<Object>> addEducation(@Valid @RequestBody EducationRequest request, Authentication authentication) {
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
        } catch (Exception e) {
            log.error("Lỗi khi thêm học vấn: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi thêm học vấn: " + e.getMessage(), "SERVER_ERROR"));
        }
    }

    @PutMapping("/educations/{id}")
    public ResponseEntity<ApiResponse<Object>> updateEducation(@PathVariable Integer id, @Valid @RequestBody EducationRequest request, Authentication authentication) {
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
    public ResponseEntity<ApiResponse<Object>> deleteEducation(@PathVariable Integer id, Authentication authentication) {
        try {
            Integer studentId = getCurrentStudentId(authentication);
            profileService.deleteEducation(id, studentId);
            return ResponseEntity.ok(ApiResponse.success("Xóa học vấn thành công", null));
        } catch (Exception e) {
            log.error("Lỗi khi xóa học vấn: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi xóa học vấn: " + e.getMessage(), "SERVER_ERROR"));
        }
    }

    /* ---- Experience ---- */
    @PostMapping("/experiences")
    public ResponseEntity<ApiResponse<Object>> addExperience(@Valid @RequestBody ExperienceRequest request, Authentication authentication) {
        try {
            Integer studentId = getCurrentStudentId(authentication);
            if (studentId == null) {
                return ResponseEntity.status(401).body(ApiResponse.error("Bạn không phải là sinh viên hoặc hồ sơ sinh viên chưa được khởi tạo", "UNAUTHORIZED"));
            }
            profileService.addExperience(studentId, Experience.builder()
                    .companyName(request.getCompanyName())
                    .jobTitle(request.getJobTitle())
                    .position(request.getJobTitle()) // Giải quyết lỗi [Field 'position' doesn't have a default value]
                    .startDate(request.getStartDate())
                    .endDate(request.getEndDate())
                    .description(request.getDescription())
                    .build());
            return ResponseEntity.ok(ApiResponse.success("Thêm kinh nghiệm thành công", null));
        } catch (Exception e) {
            log.error("Lỗi khi thêm kinh nghiệm: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi thêm kinh nghiệm: " + e.getMessage(), "SERVER_ERROR"));
        }
    }

    @PutMapping("/experiences/{id}")
    public ResponseEntity<ApiResponse<Object>> updateExperience(@PathVariable Integer id, @Valid @RequestBody ExperienceRequest request, Authentication authentication) {
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
        try {
            log.info("Bắt đầu thêm kỹ năng: skillId={}, level={}", request.getSkillId(), request.getLevel());
            if (request.getLevel() == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Cấp độ kỹ năng không được để trống", "BAD_REQUEST"));
            }
            Integer studentId = getCurrentStudentId(authentication);
            if (studentId == null) {
                return ResponseEntity.status(401).body(ApiResponse.error("Không tìm thấy sinh viên", "UNAUTHORIZED"));
            }
            skillService.addSkillToStudent(studentId, request.getSkillId(), StudentSkill.SkillLevel.valueOf(request.getLevel().toLowerCase()));
            return ResponseEntity.ok(ApiResponse.success("Thêm kỹ năng thành công", null));
        } catch (IllegalArgumentException e) {
            log.error("Lỗi dữ liệu khi thêm kỹ năng: {}", e.getMessage());
            return ResponseEntity.status(400).body(ApiResponse.error("Dữ liệu không hợp lệ: " + e.getMessage(), "BAD_REQUEST"));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi thêm kỹ năng: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi hệ thống khi thêm kỹ năng: " + e.getMessage(), "SERVER_ERROR"));
        }
    }

    @DeleteMapping("/skills/{skillId}")
    public ResponseEntity<ApiResponse<Object>> deleteSkill(@PathVariable Integer skillId, Authentication authentication) {
        try {
            Integer studentId = getCurrentStudentId(authentication);
            skillService.removeSkillFromStudent(studentId, skillId);
            return ResponseEntity.ok(ApiResponse.success("Xóa kỹ năng thành công", null));
        } catch (Exception e) {
            log.error("Lỗi khi xóa kỹ năng: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi xóa kỹ năng: " + e.getMessage(), "SERVER_ERROR"));
        }
    }

    @GetMapping("/skills/all")
    public ResponseEntity<ApiResponse<List<Skill>>> getAllSystemSkills() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh mục kỹ năng thành công", skillService.getAllSkills()));
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

    /* ---- Languages ---- */
    @PostMapping("/languages")
    public ResponseEntity<ApiResponse<Object>> addLanguage(@RequestBody LanguageRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        languageService.addLanguage(studentId, Language.builder()
                .languageName(request.getLanguageName())
                .proficiency(request.getProficiency())
                .certificate(request.getCertificate())
                .build());
        return ResponseEntity.ok(ApiResponse.success("Thêm ngoại ngữ thành công", null));
    }

    @PutMapping("/languages/{id}")
    public ResponseEntity<ApiResponse<Object>> updateLanguage(@PathVariable Integer id, @RequestBody LanguageRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        languageService.updateLanguage(id, studentId, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật ngoại ngữ thành công", null));
    }

    @DeleteMapping("/languages/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteLanguage(@PathVariable Integer id, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        languageService.deleteLanguage(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Xóa ngoại ngữ thành công", null));
    }

    /* ---- Interests ---- */
    @PostMapping("/interests")
    public ResponseEntity<ApiResponse<Object>> addInterest(@RequestBody InterestRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        interestService.addInterest(studentId, Interest.builder()
                .name(request.getName())
                .build());
        return ResponseEntity.ok(ApiResponse.success("Thêm sở thích thành công", null));
    }

    @DeleteMapping("/interests/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteInterest(@PathVariable Integer id, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        interestService.deleteInterest(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Xóa sở thích thành công", null));
    }

    /* ---- Projects ---- */
    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<Object>> addProject(@RequestBody ProjectRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        projectService.addProject(studentId, Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .repositoryUrl(request.getRepositoryUrl())
                .demoUrl(request.getDemoUrl())
                .techStack(request.getTechStack())
                .role(request.getRole())
                .build());
        return ResponseEntity.ok(ApiResponse.success("Thêm dự án thành công", null));
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Object>> updateProject(@PathVariable Integer id, @RequestBody ProjectRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        projectService.updateProject(id, studentId, Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .repositoryUrl(request.getRepositoryUrl())
                .demoUrl(request.getDemoUrl())
                .techStack(request.getTechStack())
                .role(request.getRole())
                .build());
        return ResponseEntity.ok(ApiResponse.success("Cập nhật dự án thành công", null));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteProject(@PathVariable Integer id, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        projectService.deleteProject(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Xóa dự án thành công", null));
    }

    /* ---- Activities ---- */
    @PostMapping("/activities")
    public ResponseEntity<ApiResponse<Object>> addActivity(@RequestBody ActivityRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        activityService.addActivity(studentId, Activity.builder()
                .name(request.getName())
                .organization(request.getOrganization())
                .role(request.getRole())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .build());
        return ResponseEntity.ok(ApiResponse.success("Thêm hoạt động thành công", null));
    }

    @PutMapping("/activities/{id}")
    public ResponseEntity<ApiResponse<Object>> updateActivity(@PathVariable Integer id, @RequestBody ActivityRequest request, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        activityService.updateActivity(id, studentId, Activity.builder()
                .name(request.getName())
                .organization(request.getOrganization())
                .role(request.getRole())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .build());
        return ResponseEntity.ok(ApiResponse.success("Cập nhật hoạt động thành công", null));
    }

    @DeleteMapping("/activities/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteActivity(@PathVariable Integer id, Authentication authentication) {
        Integer studentId = getCurrentStudentId(authentication);
        activityService.deleteActivity(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Xóa hoạt động thành công", null));
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
}
