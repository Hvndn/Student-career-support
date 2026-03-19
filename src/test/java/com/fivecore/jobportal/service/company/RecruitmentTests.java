package com.fivecore.jobportal.service.company;

import com.fivecore.jobportal.dto.JobRequest;
import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.repository.CompanyRepository;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.service.student.JobSearchService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecruitmentTests {

    @Mock private CompanyRepository companyRepository;
    @Mock private JobRepository jobRepository;

    @InjectMocks private CompanyService companyService;
    @InjectMocks private JobSearchService jobSearchService;

    @Test
    @DisplayName("Doanh nghiệp đăng tin tuyển dụng thành công")
    void postJob_Success() {
        Company company = new Company();
        company.setId(1);
        company.setName("FPT");
        
        JobRequest request = JobRequest.builder()
                .title("Developer")
                .jobType("fulltime")
                .build();

        when(companyRepository.findById(1)).thenReturn(Optional.of(company));
        when(jobRepository.save(any(Job.class))).thenAnswer(i -> {
            Job j = i.getArgument(0);
            j.setId(100);
            return j;
        });

        JobResponse result = companyService.postJob(1, request);

        assertNotNull(result);
        assertEquals("Developer", result.getTitle());
        assertEquals("FPT", result.getCompanyName());
    }

    @Test
    @DisplayName("Tìm kiếm việc làm trả về danh sách")
    void searchJobs_Success() {
        Company company = Company.builder().name("Test Corp").build();
        Job job = Job.builder()
                .title("Java Dev")
                .company(company)
                .description("Coding")
                .status(Job.JobStatus.open)
                .jobType(Job.JobType.fulltime)
                .build();
        when(jobRepository.findAll(any(Specification.class))).thenReturn(List.of(job));

        List<JobResponse> results = jobSearchService.searchJobs("Java", "HN", null, "fulltime");

        assertFalse(results.isEmpty());
        assertEquals("Java Dev", results.get(0).getTitle());
    }
}
