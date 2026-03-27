package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.dto.ApplicationDto;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.*;
import com.fivecore.jobportal.service.company.InterviewService;
import com.fivecore.jobportal.service.interaction.NotificationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InteractionFlowTests {

    @Mock private ApplicationRepository applicationRepository;
    @Mock private StudentRepository studentRepository;
    @Mock private JobRepository jobRepository;
    @Mock private NotificationRepository notificationRepository;
    @Mock private InterviewRepository interviewRepository;
    @Mock private com.fivecore.jobportal.service.interaction.EmailService emailService;

    @InjectMocks private ApplicationService applicationService;
    @InjectMocks private InterviewService interviewService;

    @Test
    @DisplayName("Sinh viên ứng tuyển công việc thành công")
    void applyJob_Success() {
        Company company = Company.builder().name("FPT").build();
        User user = User.builder().fullName("Test").build();
        Student student = new Student(); student.setId(1); student.setUser(user);
        Skill skill = new Skill(); skill.setName("Java");
        StudentSkill ss = new StudentSkill(); ss.setSkill(skill);
        student.setSkills(java.util.List.of(ss));
        Job job = new Job(); job.setId(1); job.setTitle("Dev"); job.setCompany(company); job.setStatus(Job.JobStatus.open); job.setJobType(Job.JobType.fulltime);

        when(studentRepository.findById(1)).thenReturn(Optional.of(student));
        when(jobRepository.findById(1)).thenReturn(Optional.of(job));
        when(applicationRepository.findByStudentIdAndJobId(1, 1)).thenReturn(Optional.empty());
        when(applicationRepository.save(any(Application.class))).thenAnswer(i -> {
            Application a = i.getArgument(0);
            a.setId(1);
            return a;
        });

        ApplicationDto result = applicationService.applyForJob(1, 1);

        assertNotNull(result);
        assertEquals("Dev", result.getJobTitle());
        verify(applicationRepository).save(any(Application.class));
    }

    @Test
    @DisplayName("Gửi thông báo thành công")
    void sendNotification_Success() {
        NotificationService ns = new NotificationService(notificationRepository);
        User user = new User();
        ns.sendNotification(user, "Title", "Message");
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    @DisplayName("Lấy danh sách thông báo theo user id")
    void getNotificationsByUser_Success() {
        NotificationService ns = new NotificationService(notificationRepository);
        Notification n1 = Notification.builder().title("Test 1").build();
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(1)).thenReturn(java.util.List.of(n1));
        
        java.util.List<Notification> result = ns.getNotificationsByUser(1);
        
        assertFalse(result.isEmpty());
        assertEquals("Test 1", result.get(0).getTitle());
    }

    @Test
    @DisplayName("Đánh dấu thông báo đã đọc thành công")
    void markAsRead_Success() {
        NotificationService ns = new NotificationService(notificationRepository);
        Notification notification = Notification.builder().id(1).isRead(false).build();
        when(notificationRepository.findById(1)).thenReturn(Optional.of(notification));
        
        ns.markAsRead(1);
        
        assertTrue(notification.getIsRead());
        verify(notificationRepository).save(notification);
    }

    @Test
    @DisplayName("Đặt lịch phỏng vấn và gửi email thành công")
    void scheduleInterview_Success() {
        User user = User.builder().email("st@test.com").fullName("Student").build();
        Student student = new Student(); student.setUser(user);
        Company company = Company.builder().name("Tech Solutions").build();
        Job job = Job.builder().title("Manager").company(company).build();
        Application app = Application.builder().id(1).student(student).job(job).build();

        interviewService.scheduleInterview(app, LocalDateTime.now(), "Office");

        verify(interviewRepository).save(any(Interview.class));
        verify(emailService).sendSimpleEmail(eq("st@test.com"), anyString(), anyString());
    }
}
