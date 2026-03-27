package com.fivecore.jobportal.service.student;

import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private JobRepository jobRepository;
    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private RecommendationService recommendationService;

    private Student mockStudent;
    private Skill mockSkill;
    private StudentSkill mockStudentSkill;

    @BeforeEach
    void setUp() {
        mockSkill = new Skill();
        mockSkill.setId(1);
        mockSkill.setName("Java");

        mockStudentSkill = new StudentSkill();
        mockStudentSkill.setSkill(mockSkill);

        mockStudent = new Student();
        mockStudent.setId(1);
        mockStudent.setSkills(new ArrayList<>(List.of(mockStudentSkill)));
    }

    @Test
    void testRecommendJobs_WithMatchingSkill_ReturnsList() {
        Company company = new Company();
        company.setName("FPT Software");

        Job job = new Job();
        job.setId(1);
        job.setTitle("Java Backend Developer");
        job.setDescription("Spring Boot Java microservices");
        job.setStatus(Job.JobStatus.open);
        job.setLocation("Ha Noi");
        job.setSalary("30 triệu");
        job.setJobType(Job.JobType.fulltime);
        job.setCompany(company);

        when(studentRepository.findById(1)).thenReturn(Optional.of(mockStudent));
        when(jobRepository.findAll()).thenReturn(List.of(job));

        List<JobResponse> result = recommendationService.recommendJobs(1);

        assertFalse(result.isEmpty());
        assertEquals("Java Backend Developer", result.get(0).getTitle());
    }

    @Test
    void testRecommendJobs_NoSkills_ReturnsEmpty() {
        mockStudent.setSkills(new ArrayList<>());
        when(studentRepository.findById(1)).thenReturn(Optional.of(mockStudent));

        List<JobResponse> result = recommendationService.recommendJobs(1);

        assertTrue(result.isEmpty());
    }

    @Test
    void testRecommendJobs_StudentNotFound_ThrowsException() {
        when(studentRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> recommendationService.recommendJobs(99));
    }

    @Test
    void testRecommendJobs_OnlyReturnsOpenJobs() {
        Company company = new Company();
        company.setName("ABC Corp");

        Job closedJob = new Job();
        closedJob.setId(2);
        closedJob.setTitle("Java Developer");
        closedJob.setDescription("Need java skills");
        closedJob.setStatus(Job.JobStatus.closed); // job đã đóng
        closedJob.setCompany(company);

        when(studentRepository.findById(1)).thenReturn(Optional.of(mockStudent));
        when(jobRepository.findAll()).thenReturn(List.of(closedJob));

        List<JobResponse> result = recommendationService.recommendJobs(1);

        assertTrue(result.isEmpty(), "Không được gợi ý job đã đóng");
    }
}
