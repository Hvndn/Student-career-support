package com.fivecore.jobportal.config;

import com.fivecore.jobportal.entity.Skill;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.StudentSkill;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.SkillRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.repository.StudentSkillRepository;
import com.fivecore.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Khởi tạo tài khoản Admin mặc định và dữ liệu mẫu khi ứng dụng bắt đầu.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeAdmin();
        initializeSampleStudents();
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

    private void initializeSampleStudents() {
        if (userRepository.findByEmail("nguyenvana@gmail.com").isPresent()) {
            return;
        }

        log.info("🌱 Đang khởi tạo dữ liệu sinh viên mẫu...");

        // Create Skills
        Skill javaSkill = getOrCreateSkill("Java", "Programming");
        Skill reactSkill = getOrCreateSkill("React", "Frontend");
        Skill sqlSkill = getOrCreateSkill("SQL", "Database");

        // Student 1: Hà Nội
        createStudent("nguyenvana@gmail.com", "Nguyễn Văn A", "Đại học Bách Khoa Hà Nội", "Công nghệ thông tin", "SV001", javaSkill);

        // Student 2: Hồ Chí Minh
        createStudent("tranvanb@gmail.com", "Trần Văn B", "Đại học Khoa học Tự nhiên", "Khoa học máy tính", "SV002", reactSkill);

        // Student 3: Đà Nẵng
        createStudent("lethic@gmail.com", "Lê Thị C", "Đại học Bách Khoa Đà Nẵng", "Hệ thống thông tin", "SV003", sqlSkill);

        log.info("✅ Đã khởi tạo xong dữ liệu sinh viên mẫu.");
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
                .studentCode(code)
                .gpa(3.5)
                .graduationYear(2025)
                .build();
        student = studentRepository.save(student);

        studentSkillRepository.save(StudentSkill.builder()
                .student(student)
                .skill(skill)
                .level(StudentSkill.SkillLevel.intermediate)
                .build());
    }
}
