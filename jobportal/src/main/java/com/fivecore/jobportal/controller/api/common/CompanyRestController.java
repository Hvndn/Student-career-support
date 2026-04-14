package com.fivecore.jobportal.controller.api.common;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.service.company.CompanyService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Controller cho phép cả Sinh viên và Khách xem danh sách công ty.
 */
@RestController("publicCompanyRestController")
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyRestController {

    private final CompanyService companyService;
    private final JobRepository jobRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyPublicResponse {
        private Integer id;
        private String name;
        private String logoUrl;
        private String industry;
        private String address;
        private String phone;
        private long jobCount;
        private boolean verified; // Giả định tất cả công ty hiện tại là thật
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CompanyPublicResponse>>> getAllCompanies() {
        List<Company> companies = companyService.getAllCompanies();
        List<CompanyPublicResponse> responses = companies.stream()
                .map(c -> CompanyPublicResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .logoUrl(c.getLogoUrl())
                        .industry(c.getIndustry())
                        .address(c.getAddress())
                        .phone(c.getPhone())
                        .jobCount(jobRepository.countByCompanyId(c.getId()))
                        .verified(true) // Đã xác thực theo mẫu
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách công ty thành công", responses));
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyDetailResponse {
        private Integer id;
        private Integer userId;
        private String name;
        private String logoUrl;
        private String industry;
        private String address;
        private String phone;
        private String email;
        private String website;
        private String description;
        private String companySize;
        private Integer foundingYear;
        private String taxId;
        private String representative;
        private List<com.fivecore.jobportal.dto.JobResponse> activeJobs;
        private boolean verified;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyDetailResponse>> getCompanyDetail(@PathVariable("id") Integer id) {
        Company company = companyService.getCompanyById(id);
        
        List<com.fivecore.jobportal.dto.JobResponse> activeJobs = company.getJobs().stream()
                .filter(job -> job.getStatus() == com.fivecore.jobportal.entity.Job.JobStatus.open)
                .map(job -> companyService.mapToResponse(job))
                .collect(Collectors.toList());

        CompanyDetailResponse response = CompanyDetailResponse.builder()
                .id(company.getId())
                .userId(company.getUser().getId())
                .name(company.getName())
                .logoUrl(company.getLogoUrl())
                .industry(company.getIndustry())
                .address(company.getAddress())
                .phone(company.getPhone())
                .email(company.getEmail())
                .website(company.getWebsite())
                .description(company.getDescription())
                .companySize(company.getCompanySize())
                .foundingYear(company.getFoundingYear())
                .taxId(company.getTaxId())
                .representative(company.getRepresentative())
                .activeJobs(activeJobs)
                .verified(true)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin chi tiết công ty thành công", response));
    }

}
