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


/**
 * Dịch vụ Doanh nghiệp (US-005, US-013).
 * Xử lý thông tin công ty và quản lý tin tuyển dụng.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;
    private final com.fivecore.jobportal.repository.SkillRepository skillRepository;

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
    public void updateCompanyInfo(Integer companyId, Company updatedData, MultipartFile logoFile, List<MultipartFile> activityFiles, List<String> existingActivityImages) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh nghiệp"));

        company.setName(updatedData.getName());
        company.setDescription(updatedData.getDescription());
        company.setWebsite(updatedData.getWebsite());
        company.setAddress(updatedData.getAddress());
        company.setEmail(updatedData.getEmail());
        company.setPhone(updatedData.getPhone());
        company.setIndustry(updatedData.getIndustry());
        company.setCompanySize(updatedData.getCompanySize());
        company.setFoundingYear(updatedData.getFoundingYear());
        company.setTaxId(updatedData.getTaxId());
        company.setRepresentative(updatedData.getRepresentative());
        company.setProvince(updatedData.getProvince());
        company.setCity(updatedData.getCity());

        if (logoFile != null && !logoFile.isEmpty()) {
            String logoUrl = storageService.saveFile(logoFile, "logos");
            company.setLogoUrl(logoUrl);
        }

        // Đồng bộ ảnh cũ (xóa những ảnh không còn trong danh sách gửi lên)
        if (existingActivityImages != null) {
            company.getActivityImages().removeIf(img -> !existingActivityImages.contains(img.getImageUrl()));
        }

        // Xử lý ảnh hoạt động mới
        if (activityFiles != null && !activityFiles.isEmpty()) {
            for (MultipartFile file : activityFiles) {
                if (!file.isEmpty()) {
                    String imageUrl = storageService.saveFile(file, "activities");
                    com.fivecore.jobportal.entity.CompanyImage companyImage = com.fivecore.jobportal.entity.CompanyImage.builder()
                            .imageUrl(imageUrl)
                            .company(company)
                            .build();
                    company.getActivityImages().add(companyImage);
                }
            }
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
                .industry(request.getIndustry())
                .level(request.getLevel())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .benefits(request.getBenefits())
                .location(request.getLocation())
                .region(request.getRegion())
                .minSalary(request.getMinSalary())
                .maxSalary(request.getMaxSalary())
                .jobType(Enum.valueOf(Job.JobType.class, request.getJobType().toLowerCase()))
                .quantity(request.getQuantity())
                .gender(request.getGender())
                .experience(request.getExperience())
                .qualification(request.getQualification())
                .deadline(request.getDeadline())
                .contactName(request.getContactName())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .status("draft".equalsIgnoreCase(request.getStatus()) ? Job.JobStatus.draft : Job.JobStatus.pending)
                .bannerUrl(request.getBannerUrl())
                .postedAt(java.time.LocalDateTime.now())
                .build();

        // Xử lý kỹ năng cho tin đăng mới
        if (request.getSkills() != null) {
            for (String skillName : request.getSkills()) {
                com.fivecore.jobportal.entity.Skill skill = skillRepository.findByName(skillName)
                        .orElseGet(() -> skillRepository.save(com.fivecore.jobportal.entity.Skill.builder().name(skillName).build()));
                
                job.getSkills().add(com.fivecore.jobportal.entity.JobSkill.builder()
                    .job(job)
                    .skill(skill)
                    .build());
            }
        }

        Job savedJob = jobRepository.save(job);
        log.info("Doanh nghiệp {} đã đăng tin mới: {}", company.getName(), savedJob.getTitle());

        return JobResponse.builder()
                .id(savedJob.getId())
                .title(savedJob.getTitle())
                .companyName(company.getName())
                .location(savedJob.getLocation())
                .salary(savedJob.getMinSalary() != null ? savedJob.getMinSalary().toString() + (savedJob.getMaxSalary() != null ? " - " + savedJob.getMaxSalary().toString() : "") : "Thỏa thuận")
                .jobType(savedJob.getJobType().name())
                .status(savedJob.getStatus().name())
                .deadline(savedJob.getDeadline())
                .imageUrl(savedJob.getBannerUrl() != null ? savedJob.getBannerUrl() : (company.getLogoUrl()))
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
     * Lấy chi tiết một tin đăng phục vụ chỉnh sửa.
     */
    public JobResponse getJobByIdForEdit(Integer companyId, Integer jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng"));
        
        if (!job.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Bạn không có quyền truy cập tin tuyển dụng này");
        }
        
        return mapToResponse(job);
    }

    /**
     * Cập nhật tin tuyển dụng.
     */
    @Transactional
    public JobResponse updateJob(Integer companyId, Integer jobId, JobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng"));
        
        if (!job.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa tin tuyển dụng này");
        }

        job.setTitle(request.getTitle() != null ? request.getTitle() : job.getTitle());
        job.setIndustry(request.getIndustry());
        job.setLevel(request.getLevel());
        job.setDescription(request.getDescription() != null ? request.getDescription() : job.getDescription());
        job.setRequirements(request.getRequirements());
        job.setBenefits(request.getBenefits());
        job.setJobType(Enum.valueOf(Job.JobType.class, request.getJobType().toLowerCase()));
        job.setQuantity(request.getQuantity());
        job.setGender(request.getGender());
        job.setExperience(request.getExperience());
        job.setQualification(request.getQualification());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        job.setLocation(request.getLocation());
        job.setRegion(request.getRegion());
        job.setDeadline(request.getDeadline());
        job.setContactName(request.getContactName());
        job.setContactEmail(request.getContactEmail());
        job.setContactPhone(request.getContactPhone());
        job.setStatus(Enum.valueOf(Job.JobStatus.class, request.getStatus().toLowerCase()));
        job.setBannerUrl(request.getBannerUrl());
        job.setPostedAt(java.time.LocalDateTime.now()); // Cập nhật thời gian thực tế khi có bất kỳ thay đổi nào

        // Cập nhật kỹ năng
        if (request.getSkills() != null) {
            job.getSkills().clear();
            for (String skillName : request.getSkills()) {
                com.fivecore.jobportal.entity.Skill skill = skillRepository.findByName(skillName)
                        .orElseGet(() -> skillRepository.save(com.fivecore.jobportal.entity.Skill.builder().name(skillName).build()));
                
                job.getSkills().add(com.fivecore.jobportal.entity.JobSkill.builder()
                    .job(job)
                    .skill(skill)
                    .build());
            }
        }

        Job updatedJob = jobRepository.save(job);
        log.info("Đã cập nhật tin tuyển dụng: {}", updatedJob.getTitle());
        return mapToResponse(updatedJob);
    }

    /**
     * Xóa tin tuyển dụng.
     */
    @Transactional
    public void deleteJob(Integer companyId, Integer jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng"));
        
        if (!job.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Bạn không có quyền xóa tin tuyển dụng này");
        }
        
        jobRepository.delete(job);
        log.info("Doanh nghiệp id {} đã xóa tin tuyển dụng id {}", companyId, jobId);
    }

    /**
     * Sao chép tin tuyển dụng.
     */
    @Transactional
    public JobResponse duplicateJob(Integer companyId, Integer jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng"));
        
        if (!job.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Bạn không có quyền sao chép tin tuyển dụng này");
        }

        Job duplicate = Job.builder()
                .company(job.getCompany())
                .title("Bản sao của " + job.getTitle())
                .industry(job.getIndustry())
                .level(job.getLevel())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .jobType(job.getJobType())
                .quantity(job.getQuantity())
                .gender(job.getGender())
                .experience(job.getExperience())
                .qualification(job.getQualification())
                .minSalary(job.getMinSalary())
                .maxSalary(job.getMaxSalary())
                .location(job.getLocation())
                .region(job.getRegion())
                .deadline(job.getDeadline())
                .contactName(job.getContactName())
                .contactEmail(job.getContactEmail())
                .contactPhone(job.getContactPhone())
                .status(Job.JobStatus.draft) // Luôn để ở dạng nháp
                .bannerUrl(job.getBannerUrl())
                .postedAt(java.time.LocalDateTime.now())
                .build();
        
        // Khởi tạo List mới để tránh null
        duplicate.setSkills(new java.util.ArrayList<>());
        
        // Copy skills
        if (job.getSkills() != null) {
            for (com.fivecore.jobportal.entity.JobSkill js : job.getSkills()) {
                duplicate.getSkills().add(com.fivecore.jobportal.entity.JobSkill.builder()
                        .job(duplicate)
                        .skill(js.getSkill())
                        .build());
            }
        }

        Job savedJob = jobRepository.save(duplicate);
        log.info("Doanh nghiệp {} đã sao chép tin id {} thành tin id {}", job.getCompany().getName(), jobId, savedJob.getId());
        return mapToResponse(savedJob);
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

    public JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompany().getName())
                .companyId(job.getCompany().getId())
                .industry(job.getIndustry())
                .level(job.getLevel())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .location(job.getLocation())
                .region(job.getRegion())
                .minSalary(job.getMinSalary())
                .maxSalary(job.getMaxSalary())
                .salary(job.getMaxSalary() != null
                        ? job.getMinSalary() + " - " + job.getMaxSalary()
                        : (job.getMinSalary() != null ? job.getMinSalary().toString() : "Thỏa thuận"))
                .jobType(job.getJobType().name())
                .status(job.getStatus().name())
                .deadline(job.getDeadline())
                .postedAt(job.getPostedAt())
                .quantity(job.getQuantity())
                .gender(job.getGender())
                .experience(job.getExperience())
                .qualification(job.getQualification())
                .viewsCount(job.getViews() != null ? job.getViews() : 0)
                .contactName(job.getContactName())
                .contactEmail(job.getContactEmail())
                .contactPhone(job.getContactPhone())
                .bannerUrl(job.getBannerUrl())
                .imageUrl(job.getBannerUrl() != null ? job.getBannerUrl() : (job.getCompany() != null ? job.getCompany().getLogoUrl() : null))
                .companySize(job.getCompany().getCompanySize())
                .website(job.getCompany().getWebsite())
                .skills(job.getSkills() != null
                        ? job.getSkills().stream()
                                .map(js -> js.getSkill().getName())
                                .collect(Collectors.toList())
                        : new java.util.ArrayList<>())
                .applicantsCount(job.getApplications() != null ? job.getApplications().size() : 0)
                .companyImages(job.getCompany().getActivityImages() != null ? 
                    job.getCompany().getActivityImages().stream().map(com.fivecore.jobportal.entity.CompanyImage::getImageUrl).collect(Collectors.toList()) : null)
                .build();
    }
}
