package com.fivecore.jobportal.service.admin;

import com.fivecore.jobportal.dto.admin.AdminStudentCreateRequest;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdminServiceTest {

    @Mock private JobRepository jobRepository;
    @Mock private ApplicationRepository applicationRepository;
    @Mock private StudentRepository studentRepository;
    @Mock private CompanyRepository companyRepository;
    @Mock private UserRepository userRepository;
    @Mock private SkillRepository skillRepository;
    @Mock private NotificationRepository notificationRepository;
    @Mock private MessageRepository messageRepository;
    @Mock private PasswordResetRequestRepository tokenRepository;
    @Mock private SavedJobRepository savedJobRepository;
    @Mock private SavedCandidateRepository savedCandidateRepository;
    @Mock private InterviewRepository interviewRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private DailyStatRepository dailyStatRepository;

    @InjectMocks
    private AdminService adminService;

    private User testUser;
    private Student testStudent;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1);
        testUser.setEmail("admin@test.com");
        testUser.setRole(User.Role.admin);
        testUser.setActive(true);

        testStudent = new Student();
        testStudent.setId(10);
        testStudent.setUser(testUser);
    }

    @Test
    @DisplayName("Test: Lấy thống kê hệ thống - Có dữ liệu")
    void testGetSystemStatistics() {
        when(jobRepository.count()).thenReturn(10L);
        when(applicationRepository.count()).thenReturn(50L);
        when(studentRepository.count()).thenReturn(20L);
        when(companyRepository.count()).thenReturn(5L);
        when(userRepository.count()).thenReturn(30L);
        when(interviewRepository.count()).thenReturn(15L);
        when(dailyStatRepository.findAll()).thenReturn(new ArrayList<>());
        when(companyRepository.findAll()).thenReturn(new ArrayList<>());
        when(userRepository.findAll(any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(new ArrayList<>()));

        Map<String, Object> stats = adminService.getSystemStatistics();

        assertEquals(10L, stats.get("totalJobs"));
        assertEquals(50L, stats.get("totalApplications"));
        assertNotNull(stats.get("dailyVisits"), "Phải có dữ liệu mock cho biểu đồ nếu DB trống");
    }

    @Test
    @DisplayName("Test: Xóa người dùng là Sinh viên - Dọn dẹp quan hệ")
    void testDeleteStudentUser() {
        testUser.setRole(User.Role.student);
        testUser.setStudent(testStudent);

        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        adminService.deleteUser(1);

        // Kiểm tra các repository con được gọi để dọn dẹp
        verify(notificationRepository).deleteByUserId(1);
        verify(tokenRepository).deleteByUserId(1);
        verify(savedCandidateRepository).deleteByStudentId(10);
        verify(savedJobRepository).deleteByStudentId(10);
        verify(studentRepository).delete(testStudent);
        verify(userRepository).delete(testUser);
    }

    @Test
    @DisplayName("Test: Khóa tài khoản người dùng")
    void testToggleUserLock() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        adminService.toggleUserLock(1, true); // Khóa

        assertFalse(testUser.isActive());
        verify(userRepository).save(testUser);
    }

    @Test
    @DisplayName("Test: Kiểm duyệt tin tuyển dụng")
    void testReviewJobPost() {
        Job job = new Job();
        job.setId(100);
        job.setTitle("Hot Job");
        job.setStatus(Job.JobStatus.pending);

        when(jobRepository.findById(100)).thenReturn(Optional.of(job));

        adminService.reviewJobPost(100, "APPROVED");

        assertEquals(Job.JobStatus.open, job.getStatus());
        verify(jobRepository).save(job);
    }

    @Test
    @DisplayName("Test: Tạo sinh viên mới - Lỗi trùng Email")
    void testCreateStudentEmailDuplicate() {
        AdminStudentCreateRequest req = new AdminStudentCreateRequest();
        req.setEmail("dup@test.com");

        when(userRepository.existsByEmail("dup@test.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> adminService.createStudentFromAdmin(req));
    }

    @Test
    @DisplayName("Test: Tạo sinh viên mới - Thành công")
    void testCreateStudentSuccess() {
        AdminStudentCreateRequest req = new AdminStudentCreateRequest();
        req.setEmail("new@test.com");
        req.setFullName("New S");
        req.setPassword("pass");
        req.setStudentIdStr("MSSV001");

        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(studentRepository.findByStudentIdStr("MSSV001")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        adminService.createStudentFromAdmin(req);

        verify(userRepository).save(argThat(user -> user.getEmail().equals("new@test.com") && user.getRole() == User.Role.student));
        verify(studentRepository).save(any(Student.class));
    }
}
