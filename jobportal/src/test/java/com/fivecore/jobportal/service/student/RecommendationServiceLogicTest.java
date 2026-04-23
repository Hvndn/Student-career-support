package com.fivecore.jobportal.service.student;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.JobSkill;
import com.fivecore.jobportal.entity.Skill;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RecommendationServiceLogicTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private JobRepository jobRepository;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private RecommendationService recommendationService;

    private Student testStudent;
    private List<Job> testJobs;

    @BeforeEach
    void setUp() {
        testStudent = new Student();
        testStudent.setId(1);
        testStudent.setMajor("IT");
        testStudent.setBio("Expert in Backend");
        testStudent.setCvData("{\"skills\":[{\"name\":\"Java\"},{\"name\":\"Spring\"}]}");

        testJobs = new ArrayList<>();
    }

    @Test
    @DisplayName("Test: Khi sinh viên không tồn tại")
    void testStudentNotFound() {
        when(studentRepository.findById(999)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> recommendationService.recommendJobs(999));
    }

    @Test
    @DisplayName("Test: Khi CV Data bị null hoặc trống")
    void testEmptyCvData() {
        testStudent.setCvData(null);
        when(studentRepository.findById(1)).thenReturn(Optional.of(testStudent));
        when(jobRepository.findAll()).thenReturn(new ArrayList<>());

        List<JobResponse> result = recommendationService.recommendJobs(1);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Test: Khi CV Data chứa JSON lỗi")
    void testInvalidJsonCvData() {
        testStudent.setCvData("invalid-json");
        when(studentRepository.findById(1)).thenReturn(Optional.of(testStudent));
        when(jobRepository.findAll()).thenReturn(new ArrayList<>());
        
        List<JobResponse> result = recommendationService.recommendJobs(1);
        assertNotNull(result);
    }

    @Test
    @DisplayName("Test: Logic tính điểm giữa Skill, Major và Bio")
    void testScoringLogic() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(testStudent));

        com.fivecore.jobportal.entity.Company company = new com.fivecore.jobportal.entity.Company();
        company.setName("Test Corp");

        // Job 1: Khớp Skill (Java) -> +10đ
        Job job1 = new Job();
        job1.setTitle("Java Dev");
        job1.setCompany(company);
        job1.setIndustry("IT"); // Khớp Major -> +5đ
        job1.setDescription("Backend developer needed"); // Khớp Bio -> +2đ
        job1.setStatus(Job.JobStatus.open);
        job1.setJobType(Job.JobType.fulltime);
        job1.setSkills(new ArrayList<>());
        
        Skill s1 = new Skill(); s1.setName("Java");
        job1.getSkills().add(JobSkill.builder().job(job1).skill(s1).build());

        // Job 2: Chỉ khớp Major -> +5đ
        Job job2 = new Job();
        job2.setTitle("Marketing");
        job2.setCompany(company);
        job2.setIndustry("IT");
        job2.setJobType(Job.JobType.fulltime);
        job2.setSkills(new ArrayList<>());
        job2.setStatus(Job.JobStatus.open);

        when(jobRepository.findAll())
                .thenReturn(Arrays.asList(job1, job2));

        List<JobResponse> result = recommendationService.recommendJobs(1);

        assertEquals(2, result.size());
        assertEquals("Java Dev", result.get(0).getTitle(), "Job 1 phải đứng đầu vì điểm cao hơn");
    }
}
