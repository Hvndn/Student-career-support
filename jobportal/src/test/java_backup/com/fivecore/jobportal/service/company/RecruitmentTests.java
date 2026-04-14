package com.fivecore.jobportal.service.company;

import com.fivecore.jobportal.dto.JobRequest;
import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.CompanyRepository;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.common.StorageService;
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
    @Mock private UserRepository userRepository;
    @Mock private StorageService storageService;

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

    @Test
    @DisplayName("Lấy thông tin công ty theo email thành công")
    void getCompanyByUserEmail_Success() {
        Company company = Company.builder().name("Test Company").build();
        User user = User.builder().email("hr@company.com").company(company).build();

        when(userRepository.findByEmail("hr@company.com")).thenReturn(Optional.of(user));

        Company result = companyService.getCompanyByUserEmail("hr@company.com");

        assertNotNull(result);
        assertEquals("Test Company", result.getName());
    }

    @Test
    @DisplayName("Cập nhật thông tin công ty thành công")
    void updateCompanyInfo_Success() {
        Company existingCompany = Company.builder().id(1).name("Old Name").build();
        Company updatedData = Company.builder().name("New Name").description("Description").build();

        when(companyRepository.findById(1)).thenReturn(Optional.of(existingCompany));

        companyService.updateCompanyInfo(1, updatedData, null);

        verify(companyRepository).save(existingCompany);
        assertEquals("New Name", existingCompany.getName());
        assertEquals("Description", existingCompany.getDescription());
    }
}
