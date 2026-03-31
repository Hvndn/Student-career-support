package com.fivecore.jobportal.service.admin;

import com.fivecore.jobportal.repository.*;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.Skill;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Dịch vụ Quản trị Hệ thống (Dành cho Admin).
 * Cung cấp các công cụ giám sát, thống kê và quản lý người dùng tập trung.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    /**
     * Lấy số liệu thống kê tổng quan cho Dashboard Admin.
     */
    public Map<String, Object> getSystemStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        stats.put("totalJobs", totalJobs);
        stats.put("totalApplications", totalApplications);
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalCompanies", companyRepository.count());
        stats.put("totalUsers", userRepository.count());
        
        stats.put("pendingCompanies", companyRepository.findAll().stream()
                .filter(c -> c.getUser() != null && !c.getUser().isActive())
                .count());
        stats.put("totalReports", 0L); 

        // Success rate: applications/jobs (tỉ lệ tương tác)
        double successRate = totalJobs > 0 ? (double) totalApplications / totalJobs * 10 : 0;
        stats.put("successRate", Math.round(successRate * 10.0) / 10.0);

        // Skill distribution (category -> count)
        Map<String, Long> skillDistribution = skillRepository.findAll().stream()
                .filter(s -> s.getCategory() != null)
                .collect(Collectors.groupingBy(Skill::getCategory, Collectors.counting()));
        stats.put("skillDistribution", skillDistribution);

        // Thêm danh sách việc làm mới nhất (Top 5)
        stats.put("recentJobs", jobRepository.findAll().stream()
                .filter(job -> job.getPostedAt() != null && job.getCompany() != null)
                .sorted((j1, j2) -> j2.getPostedAt().compareTo(j1.getPostedAt()))
                .limit(5)
                .map(job -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", job.getId());
                    map.put("title", job.getTitle());
                    map.put("companyName", job.getCompany().getName());
                    map.put("postedAt", job.getPostedAt());
                    map.put("status", job.getStatus().name());
                    return map;
                })
                .collect(Collectors.toList()));

        return stats;
    }

    /**
     * Danh sách tài khoản doanh nghiệp chờ duyệt.
     */
    public List<Company> getPendingCompanies() {
        return companyRepository.findAll().stream()
                .filter(company -> company.getUser() != null && !company.getUser().isActive())
                .collect(Collectors.toList());
    }

    /**
     * Khóa hoặc mở khóa tài khoản người dùng.
     */
    public void toggleUserLock(Integer userId, boolean lock) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setActive(!lock);
            userRepository.save(user);
            log.info("Admin đã {} tài khoản: {}", lock ? "KHÓA" : "MỞ KHÓA", user.getEmail());
        });
    }

    /**
     * Kiểm duyệt tin tuyển dụng (Thay đổi trạng thái job).
     */
    public void reviewJobPost(Integer jobId, String status) {
        jobRepository.findById(jobId).ifPresent(job -> {
            try {
                job.setStatus(Job.JobStatus.valueOf(status.toUpperCase()));
                jobRepository.save(job);
                log.info("Admin đã cập nhật trạng thái tin '{}' sang {}", job.getTitle(), status);
            } catch (IllegalArgumentException e) {
                log.error("Trạng thái job không hợp lệ: {}", status);
            }
        });
    }

    /**
     * Lấy danh sách toàn bộ tin tuyển dụng trong hệ thống.
     */
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    /**
     * Xóa vĩnh viễn tài khoản người dùng và các dữ liệu liên quan.
     */
    public void deleteUser(Integer userId) {
        userRepository.findById(userId).ifPresent(user -> {
            userRepository.delete(user);
            log.info("Admin đã XÓA vĩnh viễn tài khoản: {}", user.getEmail());
        });
    }

    /**
     * Cập nhật vai trò (role) của người dùng.
     */
    public void updateUserRole(Integer userId, User.Role newRole) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setRole(newRole);
            userRepository.save(user);
            log.info("Admin đã cập nhật VAI TRÒ cho tài khoản: {} sang {}", user.getEmail(), newRole);
        });
    }

    /**
     * Lấy thông tin chi tiết người dùng và hồ sơ tương ứng (Student/Company).
     */
    public com.fivecore.jobportal.dto.UserDetailResponse getUserDetail(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        com.fivecore.jobportal.dto.UserDetailResponse.UserDetailResponseBuilder builder = com.fivecore.jobportal.dto.UserDetailResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .active(user.isActive());

        if (user.getRole() == User.Role.student && user.getStudent() != null) {
            com.fivecore.jobportal.entity.Student student = user.getStudent();
            builder.studentProfile(com.fivecore.jobportal.dto.StudentProfileResponse.builder()
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
                    .avatarUrl(student.getAvatarUrl())
                    .skills(student.getSkills().stream().map(s -> com.fivecore.jobportal.dto.StudentProfileResponse.SkillDto.builder()
                            .id(s.getSkill().getId())
                            .name(s.getSkill().getName())
                            .level(s.getLevel() != null ? s.getLevel().name() : null)
                            .build()).collect(Collectors.toList()))
                    .educations(student.getEducations().stream().map(e -> com.fivecore.jobportal.dto.StudentProfileResponse.EducationDto.builder()
                            .id(e.getId())
                            .schoolName(e.getSchoolName())
                            .major(e.getMajor())
                            .degree(e.getDegree())
                            .startDate(e.getStartDate())
                            .endDate(e.getEndDate())
                            .description(e.getDescription())
                            .build()).collect(Collectors.toList()))
                    .experiences(student.getExperiences().stream().map(exp -> com.fivecore.jobportal.dto.StudentProfileResponse.ExperienceDto.builder()
                            .id(exp.getId())
                            .companyName(exp.getCompanyName())
                            .jobTitle(exp.getJobTitle())
                            .startDate(exp.getStartDate())
                            .endDate(exp.getEndDate())
                            .description(exp.getDescription())
                            .build()).collect(Collectors.toList()))
                    .build());
        } else if (user.getRole() == User.Role.company && user.getCompany() != null) {
            com.fivecore.jobportal.entity.Company company = user.getCompany();
            builder.companyProfile(com.fivecore.jobportal.dto.CompanyResponse.builder()
                    .id(company.getId())
                    .name(company.getName())
                    .description(company.getDescription())
                    .website(company.getWebsite())
                    .address(company.getAddress())
                    .logoUrl(company.getLogoUrl())
                    .email(company.getEmail())
                    .phone(company.getPhone())
                    .build());
        }

        return builder.build();
    }

    /**
     * Lấy danh sách người dùng có phân trang.
     */
    public org.springframework.data.domain.Page<User> getAllUsers(org.springframework.data.domain.Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    /**
     * Lấy người dùng theo ID.
     */
    public User getUserById(Integer id) {
        return userRepository.findById(id).orElse(null);
    }
}
