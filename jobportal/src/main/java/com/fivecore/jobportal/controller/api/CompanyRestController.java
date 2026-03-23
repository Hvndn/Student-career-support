package com.fivecore.jobportal.controller.api;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.dto.CompanyDashboardResponse;
import com.fivecore.jobportal.dto.CompanyResponse;
import com.fivecore.jobportal.dto.JobRequest;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.ApplicationRepository;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.auth.ApplicationService;
import com.fivecore.jobportal.service.company.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST API Controller cho Doanh nghiệp.
 */
@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyRestController {

    private final CompanyService companyService;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationService applicationService;

    private Integer getCurrentCompanyId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .map(u -> u.getCompany() != null ? u.getCompany().getId() : null)
                .orElse(null);
    }

    /**
     * API Dashboard doanh nghiệp.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<CompanyDashboardResponse>> getDashboard(Authentication authentication) {
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
                .pendingInterviewsCount(0) // Mock
                .profileViewsCount(0) // Mock
                .recentCandidates(applicationService.getRecentApplicationsByCompany(company.getId()))
                .build();

        return ResponseEntity.ok(ApiResponse.success("Lấy dashboard thành công", dashboard));
    }

    /**
     * API Đăng tin tuyển dụng.
     */
    @PostMapping("/jobs")
    public ResponseEntity<ApiResponse<Object>> postJob(@Valid @RequestBody JobRequest jobRequest, Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        companyService.postJob(companyId, jobRequest);
        return ResponseEntity.ok(ApiResponse.success("Đăng tin tuyển dụng thành công", null));
    }

    /**
     * API Lấy hồ sơ công ty.
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CompanyResponse>> getProfile(Authentication authentication) {
        Company company = companyService.getCompanyByUserEmail(authentication.getName());
        if (company == null) {
            return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy thông tin công ty", "NOT_FOUND"));
        }
        
        CompanyResponse response = CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .website(company.getWebsite())
                .address(company.getAddress())
                .logoUrl(company.getLogoUrl())
                .email(authentication.getName())
                .build();

        return ResponseEntity.ok(ApiResponse.success("Lấy hồ sơ công ty thành công", response));
    }

    /**
     * API Cập nhật thông tin công ty.
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Object>> updateProfile(@ModelAttribute Company company,
                                                            @RequestParam(value = "logoFile", required = false) MultipartFile logoFile,
                                                            Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        companyService.updateCompanyInfo(companyId, company, logoFile);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin thành công", null));
    }
}
