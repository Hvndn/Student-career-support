package com.fivecore.jobportal.service.admin;

import com.fivecore.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.dto.admin.*;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Dịch vụ Quản trị Hệ thống (Dành cho Admin).
 * Cung cấp các công cụ giám sát, thống kê và quản lý người dùng tập trung.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final NotificationRepository notificationRepository;
    private final MessageRepository messageRepository;
    private final PasswordResetRequestRepository tokenRepository;
    private final SavedJobRepository savedJobRepository;
    private final SavedCandidateRepository savedCandidateRepository;
    private final InterviewRepository interviewRepository;
    private final PasswordEncoder passwordEncoder;
    private final DailyStatRepository dailyStatRepository;
    private final CategoryRepository categoryRepository;

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
        stats.put("totalInterviews", interviewRepository.count());

        long totalVisits = dailyStatRepository.findAll().stream()
                .mapToLong(com.fivecore.jobportal.entity.DailyStat::getLoginCount).sum();
        stats.put("totalVisits", totalVisits);

        stats.put("pendingCompanies", companyRepository.findAll().stream()
                .filter(c -> !c.getUser().isActive())
                .count());
        stats.put("totalReports", 0L);

        // Success rate: applications/jobs
        double successRate = totalJobs > 0 ? (double) totalApplications / totalJobs * 10 : 0;
        stats.put("successRate", Math.round(successRate * 10.0) / 10.0);

        // Biểu đồ tròn: Industry Distribution (Doanh nghiệp theo lĩnh vực thực tế từ categories)
        List<Category> allCategories = categoryRepository.findAll();
        Map<String, Long> industryDistribution = new HashMap<>();
        
        // Khởi tạo các lĩnh vực từ bảng categories với số lượng 0
        allCategories.forEach(cat -> industryDistribution.put(cat.getName(), 0L));
        
        // Đếm số lượng doanh nghiệp cho mỗi lĩnh vực
        companyRepository.findAll().forEach(company -> {
            String ind = company.getIndustry();
            if (ind != null && industryDistribution.containsKey(ind)) {
                industryDistribution.put(ind, industryDistribution.get(ind) + 1);
            }
        });
        
        // Loại bỏ các lĩnh vực không có doanh nghiệp nào (tùy chọn, để biểu đồ không bị rối)
        // Hoặc giữ lại để hiển thị đầy đủ các lĩnh vực hệ thống đang hỗ trợ.
        // Ở đây ta giữ lại các lĩnh vực có > 0 doanh nghiệp để biểu đồ đẹp hơn
        Map<String, Long> filteredDistribution = industryDistribution.entrySet().stream()
                .filter(entry -> entry.getValue() > 0)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        stats.put("industryDistribution", filteredDistribution);

        // Biểu đồ đường: Truy cập theo ngày (Daily Visits)
        List<Map<String, Object>> dailyVisits = dailyStatRepository.findAll().stream()
                .sorted((d1, d2) -> d1.getDate().compareTo(d2.getDate()))
                .map(d -> {
                    Map<String, Object> r = new HashMap<>();
                    r.put("date", d.getDate().toString());
                    r.put("truyCap", d.getLoginCount());
                    return r;
                })
                .collect(Collectors.toList());

        // Lỡ chưa có data truy cập, ta nhét 1 vài ngày mock cho biểu đồ vẽ đẹp
        if (dailyVisits.size() < 2) {
            java.time.LocalDate td = java.time.LocalDate.now();
            dailyVisits.add(0, Map.of("date", td.minusDays(2).toString(), "truyCap", 12));
            dailyVisits.add(0, Map.of("date", td.minusDays(3).toString(), "truyCap", 24));
            dailyVisits.add(0, Map.of("date", td.minusDays(4).toString(), "truyCap", 18));
            dailyVisits.add(0, Map.of("date", td.minusDays(5).toString(), "truyCap", 35));
        }
        stats.put("dailyVisits", dailyVisits);

        // Hoạt động gần đây: 5 User mới nhất
        org.springframework.data.domain.Pageable top5 = org.springframework.data.domain.PageRequest.of(0, 5,
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC,
                        "createdAt"));
        List<Map<String, Object>> recentActivities = userRepository.findAll(top5).stream()
                .map(user -> {
                    Map<String, Object> r = new HashMap<>();
                    r.put("name", user.getFullName());
                    r.put("role", user.getRole().name());
                    r.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString()
                            : java.time.LocalDateTime.now().toString());
                    return r;
                }).collect(Collectors.toList());
        stats.put("recentActivities", recentActivities);

        // Top 5 việc làm nổi bật (nhiều lượt xem nhất, dummy check)
        List<Map<String, Object>> topJobs = jobRepository.findAll().stream()
                .sorted((j1, j2) -> {
                    Integer v1 = j1.getViews() != null ? j1.getViews() : 0;
                    Integer v2 = j2.getViews() != null ? j2.getViews() : 0;
                    return v2.compareTo(v1);
                })
                .limit(5)
                .map(job -> {
                    Map<String, Object> j = new HashMap<>();
                    j.put("id", job.getId());
                    j.put("title", job.getTitle());
                    String companyName = (job.getCompany() != null) ? job.getCompany().getName() : "N/A";
                    j.put("companyName", companyName);
                    j.put("views", job.getViews() != null ? job.getViews() : 0);
                    j.put("applicants", job.getApplications() != null ? job.getApplications().size() : 0);
                    return j;
                })
                .collect(Collectors.toList());
        stats.put("topJobs", topJobs);

        return stats;
    }

    /**
     * Danh sách tài khoản doanh nghiệp chờ duyệt (US-010).
     */
    public List<Company> getPendingCompanies() {
        return companyRepository.findAll().stream()
                .filter(company -> !company.getUser().isActive())
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật tài khoản quản trị (US-013).
     */
    public void updateAdmin(Integer userId, AdminCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quản trị viên"));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);
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
     * Lấy toàn bộ danh sách việc làm và ánh xạ sang AdminJobResponse
     */
    public List<com.fivecore.jobportal.dto.admin.AdminJobResponse> getAllJobs() {
        return jobRepository.findAll().stream().map(job -> {
            String status = "PENDING";
            if (job.getStatus() == com.fivecore.jobportal.entity.Job.JobStatus.open)
                status = "APPROVED";
            else if (job.getStatus() == com.fivecore.jobportal.entity.Job.JobStatus.rejected)
                status = "REJECTED";

            return com.fivecore.jobportal.dto.admin.AdminJobResponse.builder()
                    .id(job.getId())
                    .title(job.getTitle())
                    .companyName(job.getCompany() != null ? job.getCompany().getName() : "N/A")
                    .createdAt(job.getPostedAt())
                    .minSalary(job.getMinSalary())
                    .maxSalary(job.getMaxSalary())
                    .status(status)
                    .description(job.getDescription())
                    .requirements(job.getRequirements())
                    .benefits(job.getBenefits())
                    .jobType(job.getJobType() != null ? job.getJobType().name() : null)
                    .location(job.getLocation())
                    .industry(job.getIndustry())
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * Kiểm duyệt tin tuyển dụng (Thay đổi trạng thái job).
     */
    public void reviewJobPost(Integer jobId, String status) {
        jobRepository.findById(jobId).ifPresent(job -> {
            com.fivecore.jobportal.entity.Job.JobStatus newStatus = com.fivecore.jobportal.entity.Job.JobStatus.pending;
            if ("APPROVED".equalsIgnoreCase(status)) {
                newStatus = com.fivecore.jobportal.entity.Job.JobStatus.open;
            } else if ("REJECTED".equalsIgnoreCase(status)) {
                newStatus = com.fivecore.jobportal.entity.Job.JobStatus.rejected;
            }
            job.setStatus(newStatus);
            jobRepository.save(job);

            // Gửi thông báo cho doanh nghiệp
            String title = "Cập nhật trạng thái tin tuyển dụng";
            String statusText = "APPROVED".equalsIgnoreCase(status) ? "phê duyệt" : "từ chối";
            String message = String.format("Tin tuyển dụng <strong>%s</strong> của bạn đã được <strong>%s</strong> bởi quản trị viên.", 
                    job.getTitle(), statusText);

            if (job.getCompany() != null && job.getCompany().getUser() != null) {
                notificationRepository.save(Notification.builder()
                        .user(job.getCompany().getUser())
                        .title(title)
                        .message(message)
                        .isRead(false)
                        .build());
            }

            log.info("Admin đã cập nhật trạng thái tin '{}' sang {} và gửi thông báo cho doanh nghiệp", job.getTitle(), status);
        });
    }

    /**
     * Xóa vĩnh viễn tài khoản người dùng và dọn dẹp thủ công toàn bộ dữ liệu liên
     * quan.
     * Giải quyết triệt để lỗi ràng buộc khóa ngoại (Foreign Key Constraints).
     */
    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng để xóa"));

        log.info("Sát thực xóa tài khoản: {} (ID: {}) và các dữ liệu liên quan...", user.getEmail(), userId);

        try {
            // 1. Dọn dẹp Notification, Message, PasswordResetToken (Chung cho mọi User)
            notificationRepository.deleteByUserId(userId);
            tokenRepository.deleteByUserId(userId);
            messageRepository.deleteBySenderIdOrReceiverId(userId, userId);

            // 2. Dọn dẹp dữ liệu đặc thù theo Role
            if (user.getRole() == User.Role.student && user.getStudent() != null) {
                Student student = user.getStudent();
                Integer studentId = student.getId();

                // Xóa ứng viên đã lưu liên quan sinh viên này
                savedCandidateRepository.deleteByStudentId(studentId);
                // Xóa việc làm đã lưu
                savedJobRepository.deleteByStudentId(studentId);
                // Xóa đơn ứng tuyển & Phỏng vấn
                List<Application> apps = applicationRepository.findByStudentId(studentId);
                for (Application app : apps) {
                    interviewRepository.deleteByApplicationId(app.getId());
                }
                applicationRepository.deleteByStudentId(studentId);

                studentRepository.delete(student);

            } else if (user.getRole() == User.Role.company && user.getCompany() != null) {
                Company company = user.getCompany();
                Integer companyId = company.getId();

                // Xóa ứng viên đã lưu bởi công ty
                savedCandidateRepository.deleteByCompanyId(companyId);

                // Xóa tin tuyển dụng & Dữ liệu liên quan
                List<Job> jobs = jobRepository.findByCompanyId(companyId);
                for (Job job : jobs) {
                    List<Application> jobApps = applicationRepository.findByJobId(job.getId());
                    for (Application app : jobApps) {
                        interviewRepository.deleteByApplicationId(app.getId());
                    }
                    applicationRepository.deleteByJobId(job.getId());
                    jobRepository.delete(job);
                }

                companyRepository.delete(company);
            }

            // 3. Cuối cùng mới xóa thực thể User
            userRepository.delete(user);
            log.info("✅ Đã XÓA vĩnh viễn tài khoản: {} thành công.", user.getEmail());

        } catch (Exception e) {
            log.error("❌ Lỗi nghiêm trọng khi xóa người dùng {}: {}", user.getEmail(), e.getMessage());
            try {
                java.nio.file.Path logPath = java.nio.file.Paths.get("C:\\CNPM\\Student-career-support\\error_log.txt");
                String errorInfo = "User: " + user.getEmail() + "\nError: " + e.toString() + "\nCause: " + e.getCause()
                        + "\nStack: " +
                        java.util.Arrays.toString(e.getStackTrace());
                java.nio.file.Files.writeString(logPath, errorInfo);
            } catch (Exception logEx) {
                log.error("Không thể ghi log lỗi ra file: {}", logEx.getMessage());
            }
            throw new RuntimeException("Lỗi ràng buộc: " + e.getMessage() + " (Xem log file)");
        }
    }

    /**
     * Cập nhật vai trò (role) của người dùng.
     */
    public void updateUserRole(Integer userId, com.fivecore.jobportal.entity.User.Role newRole) {
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
        com.fivecore.jobportal.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        com.fivecore.jobportal.dto.UserDetailResponse.UserDetailResponseBuilder builder = com.fivecore.jobportal.dto.UserDetailResponse
                .builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .active(user.isActive());

        if (user.getRole() == com.fivecore.jobportal.entity.User.Role.student && user.getStudent() != null) {
            com.fivecore.jobportal.entity.Student student = user.getStudent();
            builder.studentProfile(com.fivecore.jobportal.dto.StudentProfileResponse.builder()
                    .id(student.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .studentIdStr(student.getStudentIdStr())
                    .university(student.getUniversity())
                    .major(student.getMajor())
                    .studentClass(student.getStudentClass())
                    .bio(student.getBio())
                    .avatarUrl(student.getAvatarUrl())
                    .build());
        } else if (user.getRole() == com.fivecore.jobportal.entity.User.Role.company && user.getCompany() != null) {
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
                    .industry(company.getIndustry())
                    .companySize(company.getCompanySize())
                    .foundingYear(company.getFoundingYear())
                    .build());
        }

        return builder.build();
    }

    /**
     * Lấy danh sách người dùng có phân trang.
     */
    public org.springframework.data.domain.Page<com.fivecore.jobportal.entity.User> getAllUsers(
            org.springframework.data.domain.Pageable pageable, com.fivecore.jobportal.entity.User.Role role) {
        if (role != null) {
            return userRepository.findByRole(role, pageable);
        }
        return userRepository.findAll(pageable);
    }

    /**
     * Lấy toàn bộ danh sách lịch hẹn (Interviews).
     */
    public List<AdminInterviewResponse> getAllInterviews() {
        return interviewRepository.findAllWithDetails().stream().map(i -> {
            Application app = i.getApplication();
            Job job = (app != null) ? app.getJob() : null;
            Company company = (job != null) ? job.getCompany() : null;
            Student student = (app != null) ? app.getStudent() : null;
            User studentUser = (student != null) ? student.getUser() : null;

            // Ưu tiên lấy tên từ đơn ứng tuyển (nếu có), nếu không lấy từ Profile
            String studentName = (app != null && app.getFullName() != null && !app.getFullName().isEmpty())
                    ? app.getFullName()
                    : (studentUser != null ? studentUser.getFullName() : "N/A");

            String studentEmail = (app != null && app.getEmail() != null && !app.getEmail().isEmpty())
                    ? app.getEmail()
                    : (studentUser != null ? studentUser.getEmail() : "N/A");

            return AdminInterviewResponse.builder()
                    .id(i.getId())
                    .companyName(company != null ? company.getName() : "N/A")
                    .companyLogo(company != null ? company.getLogoUrl() : null)
                    .industry(company != null ? company.getIndustry() : "N/A")
                    .department(i.getDepartment() != null ? i.getDepartment() : "N/A")
                    .studentName(studentName)
                    .studentEmail(studentEmail)
                    .studentAvatar(student != null ? student.getAvatarUrl() : null)
                    .studentIdStr(
                            student != null && student.getStudentIdStr() != null ? student.getStudentIdStr() : "N/A")
                    .major(student != null && student.getMajor() != null ? student.getMajor() : "N/A")
                    .phone(app != null && app.getPhone() != null ? app.getPhone()
                            : (student != null && student.getPhone() != null ? student.getPhone() : "N/A"))
                    .interviewDate(i.getInterviewDate())
                    .location(i.getLocation() != null ? i.getLocation() : "N/A")
                    .notes(i.getNotes() != null ? i.getNotes() : "Không có ghi chú")
                    .status(i.getStatus() != null ? i.getStatus() : "pending")
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * Cập nhật thông tin sinh viên từ tài khoản quản trị.
     */
    public void updateStudentFromAdmin(Integer userId, AdminStudentUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        user.setFullName(request.getFullName());
        user.setActive(request.isActive());
        userRepository.save(user);

        if (user.getRole() == User.Role.student && user.getStudent() != null) {
            Student student = user.getStudent();
            student.setMajor(request.getMajor());
            student.setStudentClass(request.getStudentClass());
            student.setPhone(request.getPhone());
            studentRepository.save(student);
        }
    }

    /**
     * Cập nhật thông tin doanh nghiệp từ tài khoản quản trị.
     */
    public void updateCompanyFromAdmin(Integer userId, AdminCompanyUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        user.setFullName(request.getFullName());
        user.setActive(request.isActive());
        userRepository.save(user);

        if (user.getRole() == User.Role.company && user.getCompany() != null) {
            Company company = user.getCompany();
            company.setName(request.getName());
            company.setIndustry(request.getIndustry());
            company.setWebsite(request.getWebsite());
            company.setPhone(request.getPhone());
            company.setAddress(request.getAddress());
            company.setDescription(request.getDescription());
            company.setCompanySize(request.getCompanySize());
            company.setFoundingYear(request.getFoundingYear());
            companyRepository.save(company);
        }
    }

    /**
     * Tạo mới sinh viên từ tài khoản quản trị.
     */
    @Transactional
    public void createStudentFromAdmin(AdminStudentCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại trên hệ thống");
        }

        if (studentRepository.findByStudentIdStr(request.getStudentIdStr()).isPresent()) {
            throw new RuntimeException("Mã số sinh viên (MSSV) đã tồn tại!");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(User.Role.student)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        Student student = Student.builder()
                .user(savedUser)
                .studentIdStr(request.getStudentIdStr())
                .major(request.getMajor())
                .studentClass(request.getStudentClass())
                .build();

        studentRepository.save(student);
        log.info("Admin đã tạo SINH VIÊN mới: {} (MSSV: {})", user.getEmail(), student.getStudentIdStr());
    }

    /**
     * Tạo mới tài khoản Quản trị từ tài khoản quản trị khác.
     */
    @Transactional
    public void createAdminFromAdmin(AdminCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại trên hệ thống");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(User.Role.admin)
                .isActive(true)
                .build();

        userRepository.save(user);
        log.info("Admin đã tạo QUẢN TRỊ VIÊN mới: {}", user.getEmail());
    }

    /**
     * Tạo mới Doanh nghiệp từ tài khoản quản trị.
     */
    @Transactional
    public void createCompanyFromAdmin(AdminCompanyCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại trên hệ thống");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(User.Role.company)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        Company company = Company.builder()
                .user(savedUser)
                .name(request.getName())
                .email(request.getEmail())
                .industry(request.getIndustry())
                .website(request.getWebsite())
                .phone(request.getPhone())
                .address(request.getAddress())
                .description(request.getDescription())
                .companySize(request.getCompanySize())
                .foundingYear(request.getFoundingYear())
                .build();

        companyRepository.save(company);
        log.info("Admin đã tạo DOANH NGHIỆP mới: {} (Tên: {})", user.getEmail(), company.getName());
    }

    /**
     * Xóa lịch hẹn (Interview).
     */
    public void deleteInterview(Integer interviewId) {
        interviewRepository.findById(interviewId).ifPresent(i -> {
            interviewRepository.delete(i);
            log.info("Admin đã XÓA lịch hẹn ID: {}", interviewId);
        });
    }
}
