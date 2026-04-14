package com.fivecore.jobportal.config;

import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Khởi tạo tài khoản Admin mặc định và dữ liệu mẫu khi ứng dụng bắt đầu.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final CvTemplateRepository cvTemplateRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeAdmin();
        initializeSampleCvTemplates();
        
        // Đã tắt tự động tạo dữ liệu mẫu theo lệnh của Người
        // initializeSampleSkills();
        // initializeSampleStudents();
        // initializeSampleCompaniesAndJobs();
    }

    private void initializeAdmin() {
        String adminEmail = "admin@unitalent.vn";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Super Admin")
                    .role(User.Role.admin)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            log.info("✅ Đã tạo tài khoản Admin mặc định: {}", adminEmail);
        }
    }

    private void initializeSampleSkills() {
        if (skillRepository.count() > 0) return;
        
        log.info("🌱 Khởi tạo danh mục kỹ năng mẫu...");
        getOrCreateSkill("Java", "Programming");
        getOrCreateSkill("Python", "Programming");
        getOrCreateSkill("React", "Frontend");
        getOrCreateSkill("Angular", "Frontend");
        getOrCreateSkill("SQL", "Database");
        getOrCreateSkill("Spring Boot", "Backend");
        getOrCreateSkill("Node.js", "Backend");
        getOrCreateSkill("UI/UX Design", "Design");
        getOrCreateSkill("Marketing", "Business");
    }

    private void initializeSampleStudents() {
        String studentEmail = "student@scholarbridge.vn";
        String studentCode = "SV001";
        if (userRepository.findByEmail(studentEmail).isPresent() || 
            studentRepository.findByStudentIdStr(studentCode).isPresent()) return;

        log.info("🌱 Khởi tạo dữ liệu sinh viên mẫu...");
        Skill javaSkill = getOrCreateSkill("Java", "Programming");
        createStudent(studentEmail, "Nguyễn Văn Sinh Viên", "Đại học Bách Khoa", "CNTT", studentCode, javaSkill);
    }

    private void initializeSampleCompaniesAndJobs() {
        if (userRepository.findByEmail("hr@techflow.vn").isPresent()) return;

        log.info("🌱 Khởi tạo dữ liệu doanh nghiệp và tin tuyển dụng mẫu...");

        // 1. Doanh nghiệp đã được duyệt và có tin tuyển dụng
        Company techFlow = createCompany("hr@techflow.vn", "TechFlow Solutions", "Công ty công nghệ hàng đầu", true);
        createJob(techFlow, "Senior Java Developer", "Phát triển hệ thống backend", 25000000, 40000000, Job.JobStatus.open);
        createJob(techFlow, "Product Manager", "Quản lý vòng đời sản phẩm", 30000000, 50000000, Job.JobStatus.pending);

        // 2. Doanh nghiệp ĐANG CHỜ DUYỆT (isActive = false)
        createCompany("contact@creativepulse.agency", "CreativePulse Agency", "Đơn vị truyền thông sáng tạo", false);
        createCompany("admin@fintechpro.vn", "Fintech Pro", "Giải pháp tài chính số", false);

        // 3. Tin tuyển dụng ĐANG CHỜ DUYỆT từ doanh nghiệp khác
        Company futureSoft = createCompany("jobs@futuresoft.io", "FutureSoft", "Product house chuyên về AI", true);
        createJob(futureSoft, "AI Engineer Intern", "Nghiên cứu và triển khai LLMs", 5000000, 10000000, Job.JobStatus.pending);
        createJob(futureSoft, "React Native Developer", "Xây dựng ứng dụng di động", 15000000, 25000000, Job.JobStatus.pending);
    }

    private Skill getOrCreateSkill(String name, String category) {
        return skillRepository.findByName(name)
                .orElseGet(() -> skillRepository.save(Skill.builder().name(name).category(category).build()));
    }

    private void createStudent(String email, String fullName, String university, String major, String code, Skill skill) {
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode("123456"))
                .fullName(fullName)
                .role(User.Role.student)
                .isActive(true)
                .build();
        user = userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .university(university)
                .major(major)
                .studentIdStr(code)
                .gpa(3.5)
                .graduationYear(2025)
                .build();
        studentRepository.save(student);
    }

    private Company createCompany(String email, String name, String desc, boolean isActive) {
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode("123456"))
                .fullName(name)
                .role(User.Role.company)
                .isActive(isActive)
                .build();
        user = userRepository.save(user);

        Company company = Company.builder()
                .user(user)
                .name(name)
                .description(desc)
                .address("Hà Nội")
                .email(email)
                .phone("0987654321")
                .build();
        return companyRepository.save(company);
    }

    private void createJob(Company company, String title, String desc, int min, int max, Job.JobStatus status) {
        Job job = Job.builder()
                .title(title)
                .description(desc)
                .company(company)
                .minSalary(java.math.BigDecimal.valueOf(min))
                .maxSalary(java.math.BigDecimal.valueOf(max))
                .jobType(Job.JobType.fulltime)
                .status(status)
                .postedAt(LocalDateTime.now())
                .build();
        jobRepository.save(job);
    }

    private void initializeSampleCvTemplates() {
        if (cvTemplateRepository.count() > 0) return;

        log.info("🌱 Khởi tạo danh sách mẫu CV...");

        createCvTemplate("Hiện đại Classic",    "Hiện đại",      "MODERN_1",   "/uploads/cv-templates/modern_1.png",   "Bố cục 2 cột hiện đại, sidebar màu thương hiệu.");
        createCvTemplate("Hiện đại Sáng tạo",   "Hiện đại",      "MODERN_2",   "/uploads/cv-templates/modern_2.png",   "Phong cách gradient, nhấn mạnh kỹ năng.");
        createCvTemplate("Chuyên nghiệp Basic",  "Chuyên nghiệp", "PRO_1",      "/uploads/cv-templates/pro_1.png",      "Bố cục truyền thống, phù hợp doanh nghiệp lớn.");
        createCvTemplate("Chuyên nghiệp Plus",   "Chuyên nghiệp", "PRO_2",      "/uploads/cv-templates/pro_2.png",      "Thêm timeline kinh nghiệm, phù hợp Manager.");
        createCvTemplate("Đơn giản Tối giản",    "Đơn giản",      "CLASSIC_1",  "/uploads/cv-templates/classic_1.png",  "Thiết kế tối giản, trắng đen, dễ đọc.");
        createCvTemplate("Ấn tượng Creative",    "Ấn tượng",      "CREATIVE_1", "/uploads/cv-templates/creative_1.png", "Màu sắc nổi bật, dành cho ngành sáng tạo.");
        createCvTemplate("Harvard Format",       "Harvard",       "HARVARD_1",  "/uploads/cv-templates/harvard_1.png",  "Chuẩn format Harvard, tập trung học thuật.");
        createCvTemplate("ATS Friendly",         "ATS",           "ATS_1",      "/uploads/cv-templates/ats_1.png",      "Tối ưu cho hệ thống ATS, không hình ảnh trang trí.");
    }

    private void createCvTemplate(String name, String category, String key, String thumb, String description) {
        if (cvTemplateRepository.findByLayoutKey(key).isEmpty()) {
            cvTemplateRepository.save(CvTemplate.builder()
                    .name(name)
                    .category(category)
                    .layoutKey(key)
                    .thumbnailUrl(thumb)
                    .description(description)
                    .isActive(true)
                    .build());
        }
    }
}
