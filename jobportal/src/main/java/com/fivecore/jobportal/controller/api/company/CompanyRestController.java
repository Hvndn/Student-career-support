package com.fivecore.jobportal.controller.api.company;

import com.fivecore.jobportal.dto.ApplicationDto;
import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.dto.CompanyDashboardResponse;
import com.fivecore.jobportal.dto.CompanyResponse;
import com.fivecore.jobportal.dto.JobRequest;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.*;
import com.fivecore.jobportal.service.auth.ApplicationService;
import com.fivecore.jobportal.service.company.CompanyService;
import com.fivecore.jobportal.service.common.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST API Controller cho Doanh nghiệp.
 */
@RestController("employerCompanyRestController")
@RequestMapping("/api/company")
@RequiredArgsConstructor
@Slf4j
public class CompanyRestController {

    private final CompanyService companyService;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationService applicationService;
    private final SavedCandidateRepository savedCandidateRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final StorageService storageService;

    private Integer getCurrentCompanyId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getCompany() != null ? u.getCompany().getId() : null)
                .orElse(null);
    }

    /**
     * API Dashboard doanh nghiệp.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<CompanyDashboardResponse>> getDashboard(@RequestParam(defaultValue = "7") Integer days, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null || user.getCompany() == null) {
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền truy cập", "FORBIDDEN"));
        }

        Company company = user.getCompany();
        CompanyDashboardResponse dashboard = CompanyDashboardResponse.builder()
                .fullName(user.getFullName())
                .companyName(company.getName())
                .jobs(companyService.getJobsByCompany(company.getId()))
                .activeJobsCount(jobRepository.countByCompanyId(company.getId()))
                .totalCandidatesCount(applicationRepository.countByJobCompanyId(company.getId()))
                .pendingCount(applicationRepository.countByJobCompanyIdAndStatus(company.getId(),
                        com.fivecore.jobportal.entity.Application.ApplicationStatus.pending))
                .reviewCount(applicationRepository.countByJobCompanyIdAndStatus(company.getId(),
                        com.fivecore.jobportal.entity.Application.ApplicationStatus.review))
                .interviewCount(applicationRepository.countByJobCompanyIdAndStatus(company.getId(),
                        com.fivecore.jobportal.entity.Application.ApplicationStatus.interview))
                .rejectedCount(applicationRepository.countByJobCompanyIdAndStatus(company.getId(),
                        com.fivecore.jobportal.entity.Application.ApplicationStatus.rejected))
                .pendingInterviewsCount(0) // Mock
                .profileViewsCount(0) // Mock
                .totalViews(jobRepository.findByCompanyId(company.getId()).stream()
                        .mapToLong(j -> j.getViews() != null ? j.getViews() : 0).sum())
                .applicationTrends(fetchApplicationTrends(company.getId(), days))
                .newCandidatesTodayCount(applicationRepository.countByJobCompanyIdAndAppliedAtAfter(company.getId(),
                        java.time.LocalDateTime.now().with(java.time.LocalTime.MIN)))
                .recentCandidates(applicationService.getRecentApplicationsByCompany(company.getId()))
                .build();

        return ResponseEntity.ok(ApiResponse.success("Lấy dashboard thành công", dashboard));
    }

    /**
     * API Upload Banner cho tin tuyển dụng.
     */
    @PostMapping("/jobs/upload-banner")
    public ResponseEntity<ApiResponse<String>> uploadBanner(@RequestParam("file") MultipartFile file) {
        try {
            String bannerUrl = storageService.saveFile(file, "banners");
            return ResponseEntity.ok(ApiResponse.success("Upload banner thành công", bannerUrl));
        } catch (Exception e) {
            log.error("Lỗi upload banner: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi upload: " + e.getMessage(), "UPLOAD_ERROR"));
        }
    }

    /**
     * API Đăng tin tuyển dụng.
     */
    @PostMapping("/jobs")
    public ResponseEntity<ApiResponse<Object>> postJob(@RequestBody JobRequest jobRequest,
            Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        companyService.postJob(companyId, jobRequest);
        return ResponseEntity.ok(ApiResponse.success("Đăng tin tuyển dụng thành công", null));
    }

    /**
     * API Lấy chi tiết tin đăng cấp doanh nghiệp (để sửa).
     */
    @GetMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<Object>> getJobForEdit(@PathVariable("id") Integer id,
            Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin tin đăng thành công",
                companyService.getJobByIdForEdit(companyId, id)));
    }

    /**
     * API Cập nhật tin tuyển dụng.
     */
    @PutMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<Object>> updateJob(@PathVariable("id") Integer id,
            @RequestBody JobRequest jobRequest,
            Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        companyService.updateJob(companyId, id, jobRequest);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật tin tuyển dụng thành công", null));
    }

    /**
     * API Xóa tin tuyển dụng.
     */
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteJob(@PathVariable("id") Integer id,
            Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        companyService.deleteJob(companyId, id);
        return ResponseEntity.ok(ApiResponse.success("Xóa tin tuyển dụng thành công", null));
    }

    /**
     * API Sao chép tin tuyển dụng.
     */
    @PostMapping("/jobs/{id}/duplicate")
    public ResponseEntity<ApiResponse<Object>> duplicateJob(@PathVariable("id") Integer id,
            Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        return ResponseEntity.ok(ApiResponse.success("Sao chép tin tuyển dụng thành công",
                companyService.duplicateJob(companyId, id)));
    }

    /**
     * API Lấy danh sách tin tuyển dụng của công ty hiện tại.
     */
    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<Object>> getJobs(Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        if (companyId == null) {
            // Trường hợp user có role company nhưng chưa tạo bản ghi Company
            log.warn("Người dùng {} có role company nhưng chưa có thông tin Company", authentication.getName());
            return ResponseEntity
                    .ok(ApiResponse.success("Chưa có thông tin doanh nghiệp", java.util.Collections.emptyList()));
        }
        return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách tin đăng thành công", companyService.getJobsByCompany(companyId)));
    }

    /**
     * API Lấy hồ sơ công ty.
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CompanyResponse>> getProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null || user.getRole() != User.Role.company) {
            return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền", "FORBIDDEN"));
        }

        Company company = user.getCompany();
        if (company == null) {
            return ResponseEntity.status(404)
                    .body(ApiResponse.error("Tài khoản chưa có thông tin doanh nghiệp", "NOT_FOUND"));
        }

        CompanyResponse response = CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .website(company.getWebsite())
                .address(company.getAddress())
                .logoUrl(company.getLogoUrl())
                .email(authentication.getName())
                .phone(company.getPhone())
                .industry(company.getIndustry())
                .companySize(company.getCompanySize())
                .foundingYear(company.getFoundingYear())
                .taxId(company.getTaxId())
                .representative(company.getRepresentative())
                .province(company.getProvince())
                .city(company.getCity())
                .activityImages(company.getActivityImages() != null ? 
                    company.getActivityImages().stream().map(com.fivecore.jobportal.entity.CompanyImage::getImageUrl).collect(Collectors.toList()) : 
                    new java.util.ArrayList<>())
                .build();

        return ResponseEntity.ok(ApiResponse.success("Lấy hồ sơ công ty thành công", response));
    }

    /**
     * API Cập nhật thông tin công ty.
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Object>> updateProfile(jakarta.servlet.http.HttpServletRequest request,
            @ModelAttribute Company company,
            @RequestParam(value = "logoFile", required = false) MultipartFile logoFile,
            @RequestParam(value = "activityFiles", required = false) List<MultipartFile> activityFiles,
            Authentication authentication) {
        try {
            Integer companyId = getCurrentCompanyId(authentication);
            List<String> existingImages = activityFiles != null ? null : new java.util.ArrayList<>(); 
            // Lấy danh sách ảnh cũ từ request nếu có
            String[] existing = request.getParameterValues("existingImages");
            List<String> existingList = existing != null ? java.util.Arrays.asList(existing) : new java.util.ArrayList<>();
            
            companyService.updateCompanyInfo(companyId, company, logoFile, activityFiles, existingList);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin thành công", null));
        } catch (RuntimeException e) {
            log.warn("Lỗi khi cập nhật profile doanh nghiệp: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "UPDATE_ERROR"));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi cập nhật profile doanh nghiệp: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi hệ thống", "SERVER_ERROR"));
        }
    }

    private List<Map<String, Object>> fetchApplicationTrends(Integer companyId, Integer days) {
        List<Object[]> trendData;
        Map<String, Long> dataMap = new java.util.HashMap<>();
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();

        if (days == 1) {
            java.time.LocalDateTime startDate = now.with(java.time.LocalTime.MIN);
            trendData = applicationRepository.countApplicationsByHour(companyId, startDate);
            
            // Map existing data: Hour -> Count
            for (Object[] obj : trendData) {
                dataMap.put(obj[0].toString(), ((Number) obj[1]).longValue());
            }

            // Fill all 24 hours
            for (int i = 0; i <= 23; i++) {
                String hourStr = String.format("%02d", i);
                Map<String, Object> m = new java.util.HashMap<>();
                m.put("date", hourStr + ":00");
                m.put("count", dataMap.getOrDefault(String.valueOf(i), 0L));
                result.add(m);
            }
        } else {
            java.time.LocalDateTime startDate = now.minusDays(days - 1).with(java.time.LocalTime.MIN);
            trendData = applicationRepository.countApplicationsByDay(companyId, startDate);
            
            // Map existing data: Date -> Count
            for (Object[] obj : trendData) {
                dataMap.put(obj[0].toString(), ((Number) obj[1]).longValue());
            }

            // Fill each day in the range
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
            for (int i = 0; i < days; i++) {
                java.time.LocalDate date = startDate.toLocalDate().plusDays(i);
                String dateStr = date.format(formatter);
                Map<String, Object> m = new java.util.HashMap<>();
                m.put("date", dateStr);
                m.put("count", dataMap.getOrDefault(dateStr, 0L));
                result.add(m);
            }
        }
        return result;
    }
}
