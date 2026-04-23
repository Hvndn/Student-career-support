package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.dto.ApplicationDto;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.ApplicationRepository;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.service.interaction.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private JobRepository jobRepository;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ApplicationService applicationService;

    private Student testStudent;
    private Job testJob;
    private Company testCompany;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(100);
        testUser.setFullName("Test Student");
        testUser.setEmail("student@test.com");

        testStudent = new Student();
        testStudent.setId(1);
        testStudent.setUser(testUser);

        testCompany = new Company();
        testCompany.setId(1);
        testCompany.setName("Test Corp");
        testCompany.setUser(new User());

        testJob = new Job();
        testJob.setId(1);
        testJob.setTitle("Java Dev");
        testJob.setCompany(testCompany);
        testJob.setStatus(Job.JobStatus.open);
        testJob.setSkills(new ArrayList<>());
    }

    @Test
    @DisplayName("Test: Ứng tuyển thành công")
    void testApplyForJobSuccess() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(testStudent));
        when(jobRepository.findById(1)).thenReturn(Optional.of(testJob));
        when(applicationRepository.findByStudentIdAndJobId(1, 1)).thenReturn(Optional.empty());
        when(applicationRepository.save(any(Application.class))).thenAnswer(i -> {
            Application a = i.getArgument(0);
            a.setId(50);
            return a;
        });

        ApplicationDto result = applicationService.applyForJob(1, 1, "Name", "email@com", "123", "Letter", "cv.pdf");

        assertNotNull(result);
        assertEquals("Java Dev", result.getJobTitle());
        verify(notificationService).sendNotification(any(), anyString(), anyString());
    }

    @Test
    @DisplayName("Test: Lỗi khi ứng tuyển trùng lặp")
    void testApplyDuplicate() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(testStudent));
        when(jobRepository.findById(1)).thenReturn(Optional.of(testJob));
        when(applicationRepository.findByStudentIdAndJobId(1, 1)).thenReturn(Optional.of(new Application()));

        assertThrows(RuntimeException.class, () -> applicationService.applyForJob(1, 1, "N", "E", "P", "L", "C"));
    }

    @Test
    @DisplayName("Test: Cập nhật trạng thái - Thành công")
    void testUpdateStatusSuccess() {
        Application app = new Application();
        app.setId(50);
        app.setJob(testJob);
        app.setStudent(testStudent);
        app.setStatus(Application.ApplicationStatus.pending);

        when(applicationRepository.findById(50)).thenReturn(Optional.of(app));

        applicationService.updateApplicationStatus(50, Application.ApplicationStatus.accepted, 1);

        assertEquals(Application.ApplicationStatus.accepted, app.getStatus());
        verify(applicationRepository).save(app);
        verify(notificationService).sendNotification(eq(testUser), contains("Chúc mừng"), anyString());
    }

    @Test
    @DisplayName("Test: Cập nhật trạng thái - Lỗi do sai công ty")
    void testUpdateStatusUnauthorized() {
        Application app = new Application();
        app.setJob(testJob);
        
        when(applicationRepository.findById(50)).thenReturn(Optional.of(app));

        // Company ID 2 cố gắng duyệt Job của Company ID 1
        assertThrows(RuntimeException.class, () -> applicationService.updateApplicationStatus(50, Application.ApplicationStatus.accepted, 2));
    }

    @Test
    @DisplayName("Test: Hủy đơn ứng tuyển - Thành công")
    void testCancelApplicationSuccess() {
        Application app = new Application();
        app.setStudent(testStudent);
        app.setStatus(Application.ApplicationStatus.pending);

        when(applicationRepository.findByStudentIdAndJobId(1, 1)).thenReturn(Optional.of(app));

        applicationService.cancelApplication(1, 1);

        verify(applicationRepository).delete(app);
    }

    @Test
    @DisplayName("Test: Hủy đơn ứng tuyển - Lỗi do trạng thái không phải pending")
    void testCancelApplicationInvalidStatus() {
        Application app = new Application();
        app.setStudent(testStudent);
        app.setStatus(Application.ApplicationStatus.accepted);

        when(applicationRepository.findByStudentIdAndJobId(1, 1)).thenReturn(Optional.of(app));

        assertThrows(RuntimeException.class, () -> applicationService.cancelApplication(1, 1));
    }

    @Test
    @DisplayName("Test: Format lương trong mapToDto")
    void testSalaryFormatting() {
        testJob.setMinSalary(new BigDecimal(10));
        testJob.setMaxSalary(new BigDecimal(20));
        
        Application app = new Application();
        app.setJob(testJob);
        app.setStudent(testStudent);
        app.setStatus(Application.ApplicationStatus.pending);

        // Sử dụng reflection hoặc gọi qua phương thức public nếu có để test mapToDto
        // Ở đây tôi sẽ test gián tiếp qua applyForJob để đảm bảo 100% line coverage
        when(studentRepository.findById(1)).thenReturn(Optional.of(testStudent));
        when(jobRepository.findById(1)).thenReturn(Optional.of(testJob));
        when(applicationRepository.save(any())).thenReturn(app);

        ApplicationDto dto = applicationService.applyForJob(1, 1, "N", "E", "P", "L", "C");
        assertEquals("10 - 20 triệu", dto.getSalaryRange());
    }
}
