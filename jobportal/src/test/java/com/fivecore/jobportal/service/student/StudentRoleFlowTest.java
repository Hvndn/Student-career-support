package com.fivecore.jobportal.service.student;

import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class StudentRoleFlowTest {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Test
    @DisplayName("Kiểm thử quy trình gợi ý việc làm dựa trên Kỹ năng trong CV")
    public void testRecommendationBasedOnCvSkills() {
        // 1. Khởi tạo Sinh viên có kỹ năng "Java" và "Spring Boot" trong CV JSON
        User user = userRepository.save(User.builder()
                .fullName("Sinh viên Kiểm thử")
                .email("test-student@dau.edu.vn")
                .password("password")
                .role(User.Role.student)
                .build());
        
        String cvJson = "{\"skills\":[{\"name\":\"Java\"},{\"name\":\"Spring Boot\"}]}";
        Student student = studentRepository.save(Student.builder()
                .user(user)
                .cvData(cvJson)
                .studentIdStr("SV-TEST-001")
                .major("Công nghệ thông tin")
                .build());

        // 2. Khởi tạo danh mục Kỹ năng trong hệ thống (Kiểm tra tránh trùng lặp)
        Skill javaSkill = skillRepository.findByName("Java")
                .orElseGet(() -> skillRepository.save(Skill.builder().name("Java").category("Backend").build()));
        Skill reactSkill = skillRepository.findByName("React")
                .orElseGet(() -> skillRepository.save(Skill.builder().name("React").category("Frontend").build()));

        // 3. Khởi tạo Doanh nghiệp giả lập (Cần có User đi kèm)
        User companyUser = userRepository.save(User.builder()
                .fullName("Đại diện Test Corp")
                .email("hr-test@corp.com")
                .password("password")
                .role(User.Role.company)
                .build());

        Company company = companyRepository.save(Company.builder()
                .name("DAU Career Test Corp")
                .user(companyUser)
                .email("contact@testcorp.com")
                .build());

        // 4. Tạo 2 Công việc: 
        // - Job A: Yêu cầu Java (Khớp với CV)
        // - Job B: Yêu cầu React (Không khớp với CV)
        
        Job javaJob = Job.builder()
                .title("Kỹ sư lập trình Java")
                .company(company)
                .status(Job.JobStatus.open)
                .jobType(Job.JobType.fulltime)
                .description("Yêu cầu ứng viên có kiến thức về Java Core")
                .skills(new ArrayList<>())
                .build();
        javaJob = jobRepository.save(javaJob);
        javaJob.getSkills().add(JobSkill.builder().job(javaJob).skill(javaSkill).build());
        jobRepository.save(javaJob);

        Job reactJob = Job.builder()
                .title("Frontend React Developer")
                .company(company)
                .status(Job.JobStatus.open)
                .jobType(Job.JobType.fulltime)
                .description("Yêu cầu ứng viên giỏi ReactJS và CSS")
                .skills(new ArrayList<>())
                .build();
        reactJob = jobRepository.save(reactJob);
        reactJob.getSkills().add(JobSkill.builder().job(reactJob).skill(reactSkill).build());
        jobRepository.save(reactJob);

        // 5. Thực hiện lấy gợi ý
        List<JobResponse> recommendations = recommendationService.recommendJobs(student.getId());

        // 6. Kiểm định kết quả
        assertFalse(recommendations.isEmpty(), "Danh sách gợi ý không được trống");
        
        // Công việc Java phải đứng đầu vì khớp kỹ năng trong CV (+10 điểm)
        assertEquals("Kỹ sư lập trình Java", recommendations.get(0).getTitle(), 
            "Công việc Java phải được gợi ý ưu tiên cho sinh viên có kỹ năng Java");
        
        System.out.println("Kiểm thử thành công: Việc làm '" + recommendations.get(0).getTitle() + "' được gợi ý chính xác.");
    }
}
