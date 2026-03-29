package com.fivecore.jobportal.service.company;

import com.fivecore.jobportal.dto.JobRequest;
import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.CompanyRepository;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.common.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

import java.util.List;

/**
 * Dịch vụ Doanh nghiệp (US-005, US-013).
 * Xử lý thông tin công ty và quản lý tin tuyển dụng.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    /**
     * Lấy thông tin công ty theo Email người dùng.
     */
    public Company getCompanyByUserEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getCompany)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin doanh nghiệp cho tài khoản này"));
    }

    /**
     * Cập nhật thông tin doanh nghiệp (US-013).
     */
    @Transactional
    public void updateCompanyInfo(Integer companyId, Company updatedData, MultipartFile logoFile) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh nghiệp"));

        company.setName(updatedData.getName());
        company.setDescription(updatedData.getDescription());
        company.setWebsite(updatedData.getWebsite());
        company.setAddress(updatedData.getAddress());
        company.setEmail(updatedData.getEmail());
        company.setPhone(updatedData.getPhone());

        if (logoFile != null && !logoFile.isEmpty()) {
            String logoUrl = storageService.saveFile(logoFile, "logos");
            company.setLogoUrl(logoUrl);
        }

        companyRepository.save(company);
        log.info("Đã cập nhật thông tin cho doanh nghiệp: {}", company.getName());
    }

    /**
     * Đăng tin tuyển dụng mới (US-005).
     */
    @Transactional
    public JobResponse postJob(Integer companyId, JobRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh nghiệp"));

        Job job = Job.builder()
                .company(company)
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .salary(request.getSalary())
                .jobType(Job.JobType.valueOf(request.getJobType().toLowerCase()))
                .deadline(request.getDeadline())
                .status(Job.JobStatus.open)
                .build();

        Job savedJob = jobRepository.save(job);
        log.info("Doanh nghiệp {} đã đăng tin mới: {}", company.getName(), savedJob.getTitle());

        return JobResponse.builder()
                .id(savedJob.getId())
                .title(savedJob.getTitle())
                .companyName(company.getName())
                .location(savedJob.getLocation())
                .salary(savedJob.getSalary())
                .jobType(savedJob.getJobType().name())
                .status(savedJob.getStatus().name())
                .deadline(savedJob.getDeadline())
                .build();
    }

    /**
     * Lấy danh sách tin tuyển dụng của một công ty.
     */
    public List<JobResponse> getJobsByCompany(Integer companyId) {
        return jobRepository.findByCompanyId(companyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thông tin chi tiết một công ty.
     */
    public Company getCompanyById(Integer id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh nghiệp"));
    }

    /**
     * Lấy danh sách tất cả công ty.
     */
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    /**
     * Lấy tin tuyển dụng để chỉnh sửa (US-005).
     */
    public JobResponse getJobByIdForEdit(Integer jobId, Integer companyId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng"));

        if (!job.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa tin tuyển dụng này");
        }

        return mapToResponse(job);
    }

    /**
     * Cập nhật tin tuyển dụng (US-005).
     */
    @Transactional
    public void updateJob(Integer jobId, Integer companyId, JobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng"));

        if (!job.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa tin tuyển dụng này");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setJobType(Job.JobType.valueOf(request.getJobType().toLowerCase()));
        job.setDeadline(request.getDeadline());

        jobRepository.save(job);
        log.info("Đã cập nhật tin tuyển dụng ID {}: {}", jobId, job.getTitle());
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompany().getName())
                .location(job.getLocation())
                .salary(job.getSalary())
                .jobType(job.getJobType().name())
                .status(job.getStatus().name())
                .deadline(job.getDeadline())
                .build();
    }
}
