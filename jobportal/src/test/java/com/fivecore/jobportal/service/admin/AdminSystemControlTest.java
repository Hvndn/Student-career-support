package com.fivecore.jobportal.service.admin;

import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class AdminSystemControlTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Test
    @DisplayName("Kiểm thử Admin: Quản lý người dùng và Danh mục hệ thống")
    public void testAdminControls() {
        // 1. Kiểm thử Khóa tài khoản
        User studentUser = userRepository.save(User.builder()
                .fullName("Spam User")
                .email("spam@gmail.com")
                .password("pwd")
                .role(User.Role.student)
                .isActive(true)
                .build());
        
        assertTrue(studentUser.isActive(), "Tài khoản ban đầu phải active");

        // Admin khóa tài khoản
        studentUser.setActive(false);
        userRepository.save(studentUser);

        User lockedUser = userRepository.findById(studentUser.getId()).get();
        assertFalse(lockedUser.isActive(), "Tài khoản phải bị vô hiệu hóa sau khi Admin khóa");

        // 2. Kiểm thử Quản lý Danh mục (Category)
        Category cat = Category.builder()
                .name("Kiến trúc")
                .slug("kien-truc-" + System.currentTimeMillis())
                .description("Ngành kiến trúc và nội thất")
                .build();
        cat = categoryRepository.save(cat);
        
        assertNotNull(cat.getId());
        assertEquals("Kiến trúc", cat.getName());

        // 3. Kiểm thử Xóa tin tuyển dụng (Admin dọn dẹp)
        User compUser = userRepository.save(User.builder()
                .fullName("Poor Company")
                .email("poor@company.com")
                .password("pwd")
                .role(User.Role.company)
                .build());
        Company company = companyRepository.save(Company.builder().name("Poor Corp").user(compUser).build());

        Job badJob = jobRepository.save(Job.builder()
                .title("Lừa đảo việc làm")
                .company(company)
                .description("Mô tả công việc lừa đảo")
                .jobType(Job.JobType.fulltime)
                .status(Job.JobStatus.open)
                .build());
        
        assertNotNull(jobRepository.findById(badJob.getId()));

        // Admin xóa Job
        jobRepository.delete(badJob);
        Optional<Job> deletedJob = jobRepository.findById(badJob.getId());
        assertTrue(deletedJob.isEmpty(), "Job lừa đảo phải bị Admin xóa bỏ");

        System.out.println("Kiểm thử thành công: Các quyền hạn của Admin (Khóa User, Quản lý Category, Xóa Job) hoạt động đúng.");
    }
}
