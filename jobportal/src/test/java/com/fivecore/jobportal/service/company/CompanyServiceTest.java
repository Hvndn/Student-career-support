package com.fivecore.jobportal.service.company;

import com.fivecore.jobportal.dto.JobRequest;
import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.CompanyRepository;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.common.StorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CompanyServiceTest {

    @Mock private CompanyRepository companyRepository;
    @Mock private JobRepository jobRepository;
    @Mock private UserRepository userRepository;
    @Mock private StorageService storageService;

    @InjectMocks
    private CompanyService companyService;

    private Company testCompany;
    private Job testJob;

    @BeforeEach
    void setUp() {
        testCompany = new Company();
        testCompany.setId(1);
        testCompany.setName("Test Company");

        testJob = new Job();
        testJob.setId(100);
        testJob.setTitle("Original Job");
        testJob.setCompany(testCompany);
        testJob.setStatus(Job.JobStatus.open);
        testJob.setJobType(Job.JobType.fulltime);
        testJob.setSkills(new ArrayList<>());
    }

    @Test
    @DisplayName("Test: Cập nhật thông tin công ty")
    void testUpdateCompanyInfo() {
        Company updatedData = new Company();
        updatedData.setName("New Name");
        MultipartFile logo = mock(MultipartFile.class);

        when(companyRepository.findById(1)).thenReturn(Optional.of(testCompany));
        when(logo.isEmpty()).thenReturn(false);
        when(storageService.saveFile(any(), anyString())).thenReturn("new_logo.png");

        companyService.updateCompanyInfo(1, updatedData, logo, new ArrayList<>());

        assertEquals("New Name", testCompany.getName());
        assertEquals("new_logo.png", testCompany.getLogoUrl());
        verify(companyRepository).save(testCompany);
    }

    @Test
    @DisplayName("Test: Đăng tin tuyển dụng thành công")
    void testPostJobSuccess() {
        JobRequest req = new JobRequest();
        req.setTitle("New Developer");
        req.setJobType("fulltime");

        when(companyRepository.findById(1)).thenReturn(Optional.of(testCompany));
        when(jobRepository.save(any(Job.class))).thenAnswer(i -> {
            Job j = i.getArgument(0);
            j.setId(200);
            return j;
        });

        JobResponse response = companyService.postJob(1, req);

        assertNotNull(response);
        assertEquals("New Developer", response.getTitle());
    }

    @Test
    @DisplayName("Test: Cập nhật tin tuyển dụng - Kiểm tra quyền sở hữu")
    void testUpdateJobUnauthorized() {
        JobRequest req = new JobRequest();
        Company otherCompany = new Company();
        otherCompany.setId(2);
        testJob.setCompany(otherCompany);

        when(jobRepository.findById(100)).thenReturn(Optional.of(testJob));

        assertThrows(RuntimeException.class, () -> companyService.updateJob(1, 100, req));
    }

    @Test
    @DisplayName("Test: Sao chép tin tuyển dụng")
    void testDuplicateJob() {
        when(jobRepository.findById(100)).thenReturn(Optional.of(testJob));
        when(jobRepository.save(any(Job.class))).thenAnswer(i -> i.getArgument(0));

        JobResponse response = companyService.duplicateJob(1, 100);

        assertTrue(response.getTitle().contains("Bản sao của"));
        assertEquals("draft", response.getStatus()); // Bản sao luôn ở trạng thái nháp
    }

    @Test
    @DisplayName("Test: Map Job sang Response - Format lương")
    void testMapToResponseSalary() {
        testJob.setMinSalary(new BigDecimal(15));
        testJob.setMaxSalary(new BigDecimal(30));

        JobResponse response = companyService.mapToResponse(testJob);

        assertEquals("15 - 30", response.getSalary());
    }

    @Test
    @DisplayName("Test: Cập nhật kỹ năng cho tin tuyển dụng")
    void testUpdateJobSkills() {
        JobRequest req = new JobRequest();
        req.setSkills(Arrays.asList("Java", "Spring"));
        req.setJobType("fulltime");
        req.setStatus("open");

        when(jobRepository.findById(100)).thenReturn(Optional.of(testJob));
        when(jobRepository.save(any(Job.class))).thenReturn(testJob);

        companyService.updateJob(1, 100, req);

        assertEquals(2, testJob.getSkills().size());
        assertEquals("Java", testJob.getSkills().get(0).getSkill().getName());
    }
}
