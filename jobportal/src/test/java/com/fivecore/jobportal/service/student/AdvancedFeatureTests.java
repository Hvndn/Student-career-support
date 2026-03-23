package com.fivecore.jobportal.service.student;

import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.Skill;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.StudentSkill;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.service.auth.SkillService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdvancedFeatureTests {

    @Mock private JobRepository jobRepository;
    @Mock private StudentRepository studentRepository;
    @Mock private com.fivecore.jobportal.repository.SkillRepository skillRepository;

    @InjectMocks private RecommendationService recommendationService;
    @InjectMocks private SkillService skillService;

    @Test
    @DisplayName("Gợi ý việc làm dựa trên kỹ năng trùng khớp")
    void recommendation_Success() {
        Skill skill = Skill.builder().name("Java").build();
        StudentSkill ss = StudentSkill.builder().skill(skill).build();
        Student student = new Student(); 
        student.setSkills(List.of(ss));

        Company company = Company.builder().name("Google").build();
        Job job = Job.builder()
                .title("Senior Java Developer")
                .description("Java programming")
                .company(company)
                .status(Job.JobStatus.open)
                .jobType(Job.JobType.fulltime)
                .build();

        when(studentRepository.findById(1)).thenReturn(Optional.of(student));
        when(jobRepository.findAll()).thenReturn(List.of(job));

        List<JobResponse> result = recommendationService.recommendJobs(1);

        assertFalse(result.isEmpty());
        assertEquals("Senior Java Developer", result.get(0).getTitle());
    }

    @Test
    @DisplayName("Admin tạo kỹ năng mới thành công")
    void createSkill_Success() {
        when(skillRepository.save(any(Skill.class))).thenAnswer(i -> i.getArgument(0));

        Skill skill = skillService.createNewSkill("NewTech", "Dev");

        assertNotNull(skill);
        assertEquals("NewTech", skill.getName());
    }
}
