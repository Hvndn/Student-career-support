package com.fivecore.jobportal.service.company;

import com.fivecore.jobportal.dto.JobRequest;
import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.ApplicationRepository;
import com.fivecore.jobportal.repository.CompanyRepository;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.SkillRepository;
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
    private final SkillRepository skillRepository;
    private final ApplicationRepository applicationRepository;

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
                .title(request.getTitle() != null ? request.getTitle() : "Tin tuyển dụng mới (Bản nháp)")
                .industry(request.getIndustry())
                .level(request.getLevel())
                .description(request.getDescription() != null ? request.getDescription() : "Chưa có mô tả chi tiết.")
                .requirements(request.getRequirements())
                .benefits(request.getBenefits())
                .jobType(mapJobType(request.getJobType()))
                .quantity(request.getQuantity())
                .gender(request.getGender())
                .experience(request.getExperience())
                .qualification(request.getQualification())
                .salaryType(request.getSalaryType())
                .minSalary(request.getMinSalary())
                .maxSalary(request.getMaxSalary())
                .region(request.getRegion())
                .location(request.getLocation())
                .deadline(request.getDeadline())
                .contactName(request.getContactName())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .status(mapJobStatus(request.getStatus()))
                .postedAt(java.time.LocalDateTime.now()) // Thiết lập thời gian đăng ban đầu
                .build();

        // Xử lý kỹ năng
        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
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
        
        return mapToResponse(savedJob);
    }

    private Job.JobType mapJobType(String type) {
        if (type == null) return Job.JobType.fulltime;
        String t = type.toLowerCase();
        if (t.equals("intern") || t.contains("thực tập")) return Job.JobType.intern;
        if (t.equals("parttime") || t.contains("bán thời gian")) return Job.JobType.parttime;
        if (t.equals("freelance") || t.contains("tự do")) return Job.JobType.freelance;
        if (t.equals("remote") || t.contains("từ xa")) return Job.JobType.remote;
        return Job.JobType.fulltime;
    }

    private Job.JobStatus mapJobStatus(String status) {
        if (status == null) return Job.JobStatus.pending;
        String s = status.toLowerCase();
        if (s.equals("draft")) return Job.JobStatus.draft;
        if (s.equals("pending")) return Job.JobStatus.pending;
        if (s.equals("rejected") || s.equals("canceled")) return Job.JobStatus.rejected;
        if (s.equals("closed")) return Job.JobStatus.closed;
        if (s.equals("archived")) return Job.JobStatus.archived;
        if (s.equals("open") || s.equals("active")) return Job.JobStatus.open;
        return Job.JobStatus.pending;
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
        job.setJobType(mapJobType(request.getJobType()));
        job.setQuantity(request.getQuantity());
        job.setGender(request.getGender());
        job.setExperience(request.getExperience());
        job.setQualification(request.getQualification());
        job.setSalaryType(request.getSalaryType());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        job.setRegion(request.getRegion());
        job.setLocation(request.getLocation());
        job.setDeadline(request.getDeadline());
        job.setContactName(request.getContactName());
        job.setContactEmail(request.getContactEmail());
        job.setContactPhone(request.getContactPhone());
        job.setStatus(mapJobStatus(request.getStatus()));
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

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompany().getName())
                .industry(job.getIndustry())
                .level(job.getLevel())
                .location(job.getLocation())
                .region(job.getRegion())
                .salaryType(job.getSalaryType())
                .minSalary(job.getMinSalary())
                .maxSalary(job.getMaxSalary())
                .jobType(job.getJobType().name())
                .experience(job.getExperience())
                .qualification(job.getQualification())
                .status(job.getStatus().name())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .deadline(job.getDeadline())
                .postedAt(job.getPostedAt()) // Trả về đầy đủ LocalDateTime
                .quantity(job.getQuantity())
                .gender(job.getGender())
                .viewsCount(job.getViews() != null ? job.getViews() : 0)
                .applicantsCount((int) applicationRepository.countByJobId(job.getId()))
                .contactName(job.getContactName())
                .contactEmail(job.getContactEmail())
                .contactPhone(job.getContactPhone())
                .skills(job.getSkills().stream()
                        .map(js -> js.getSkill().getName())
                        .collect(Collectors.toList()))
                .build();
    }
}
