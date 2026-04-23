package com.fivecore.jobportal.service.company;

import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.*;
import com.fivecore.jobportal.service.auth.ApplicationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class CompanyRecruitmentFlowTest {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Test
    @DisplayName("Kiểm thử luồng Doanh nghiệp: Đăng tin -> Nhận đơn -> Duyệt đơn")
    public void testFullRecruitmentFlow() {
        // 1. Setup một Doanh nghiệp
        User compUser = userRepository.save(User.builder()
                .fullName("HR Manager")
                .email("hr@company.com")
                .password("password")
                .role(User.Role.company)
                .build());
        Company company = companyRepository.save(Company.builder().name("Test Tech Corp").user(compUser).build());

        // 2. Setup một Kỹ năng
        Skill javaSkill = skillRepository.findByName("Java")
                .orElseGet(() -> skillRepository.save(Skill.builder().name("Java").build()));

        // 3. Doanh nghiệp Đăng tin tuyển dụng
        Job job = Job.builder()
                .title("Senior Java Developer")
                .company(company)
                .status(Job.JobStatus.open)
                .jobType(Job.JobType.fulltime)
                .description("Yêu cầu ứng viên giỏi Java và Spring Boot")
                .skills(new ArrayList<>())
                .build();
        job = jobRepository.save(job);
        job.getSkills().add(JobSkill.builder().job(job).skill(javaSkill).build());
        job = jobRepository.save(job);

        assertNotNull(job.getId(), "Job phải được lưu thành công");
        assertEquals(1, job.getSkills().size(), "Job phải có đúng 1 kỹ năng yêu cầu");

        // 4. Giả lập một Sinh viên Ứng tuyển
        User stuUser = userRepository.save(User.builder()
                .fullName("Ứng viên 1")
                .email("candidate1@gmail.com")
                .password("password")
                .role(User.Role.student)
                .build());
        Student student = studentRepository.save(Student.builder().user(stuUser).studentIdStr("STU001").build());

        applicationService.applyForJob(student.getId(), job.getId(), "Ứng viên 1", "candidate1@gmail.com", "0123", "Tôi rất muốn làm", null);
        
        Application application = applicationRepository.findAll().stream()
                .filter(a -> a.getStudent().getId().equals(student.getId()))
                .findFirst()
                .orElse(null);

        assertNotNull(application, "Đơn ứng tuyển phải được tạo");
        assertEquals(Application.ApplicationStatus.pending, application.getStatus(), "Trạng thái ban đầu phải là pending");

        // 5. Doanh nghiệp Duyệt đơn (Accepted)
        application.setStatus(Application.ApplicationStatus.accepted);
        applicationRepository.save(application);

        Application updatedApp = applicationRepository.findById(application.getId()).get();
        assertEquals(Application.ApplicationStatus.accepted, updatedApp.getStatus(), "Trạng thái đơn phải được cập nhật thành đã duyệt (accepted)");
        
        System.out.println("Kiểm thử thành công: Luồng tuyển dụng (Đăng tin -> Ứng tuyển -> Duyệt) hoạt động chuẩn.");
    }
}
