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
                .pendingCount(applicationRepository.countByJobCompanyIdAndStatus(company.getId(), com.fivecore.jobportal.entity.Application.ApplicationStatus.pending))
                .reviewCount(applicationRepository.countByJobCompanyIdAndStatus(company.getId(), com.fivecore.jobportal.entity.Application.ApplicationStatus.review))
                .suitableCount(applicationRepository.countByJobCompanyIdAndStatus(company.getId(), com.fivecore.jobportal.entity.Application.ApplicationStatus.suitable))
                .interviewCount(applicationRepository.countByJobCompanyIdAndStatus(company.getId(), com.fivecore.jobportal.entity.Application.ApplicationStatus.interview))
                .acceptedCount(applicationRepository.countByJobCompanyIdAndStatus(company.getId(), com.fivecore.jobportal.entity.Application.ApplicationStatus.accepted))
                .rejectedCount(applicationRepository.countByJobCompanyIdAndStatus(company.getId(), com.fivecore.jobportal.entity.Application.ApplicationStatus.rejected))
                .pendingInterviewsCount(0) // Mock
                .profileViewsCount(0) // Mock
                .newCandidatesTodayCount(applicationRepository.countByJobCompanyIdAndAppliedAtAfter(company.getId(), java.time.LocalDateTime.now().with(java.time.LocalTime.MIN)))
                .recentCandidates(applicationService.getRecentApplicationsByCompany(company.getId()))
                .build();

        return ResponseEntity.ok(ApiResponse.success("Lấy dashboard thành công", dashboard));
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
    public ResponseEntity<ApiResponse<Object>> deleteJob(@PathVariable("id") Integer id, Authentication authentication) {
        Integer companyId = getCurrentCompanyId(authentication);
        companyService.deleteJob(companyId, id);
        return ResponseEntity.ok(ApiResponse.success("Xóa tin tuyển dụng thành công", null));
    }

    /**
     * API Sao chép tin tuyển dụng.
     */
    @PostMapping("/jobs/{id}/duplicate")
    public ResponseEntity<ApiResponse<Object>> duplicateJob(@PathVariable("id") Integer id, Authentication authentication) {
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
                .phone(company.getPhone())
                .industry(company.getIndustry())
                .companySize(company.getCompanySize())
                .foundingYear(company.getFoundingYear())
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
        try {
            Integer companyId = getCurrentCompanyId(authentication);
            companyService.updateCompanyInfo(companyId, company, logoFile);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin thành công", null));
        } catch (RuntimeException e) {
            log.warn("Lỗi khi cập nhật profile doanh nghiệp: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "UPDATE_ERROR"));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi cập nhật profile doanh nghiệp: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi hệ thống", "SERVER_ERROR"));
        }
    }
}

