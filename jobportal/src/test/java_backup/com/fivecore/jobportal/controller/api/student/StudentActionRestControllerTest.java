package com.fivecore.jobportal.controller.api.student;

import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.auth.ApplicationService;
import com.fivecore.jobportal.service.interaction.NotificationService;
import com.fivecore.jobportal.service.student.SavedJobService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class StudentActionRestControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ApplicationService applicationService;
    @Mock
    private NotificationService notificationService;
    @Mock
    private SavedJobService savedJobService;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StudentActionRestController studentActionRestController;

    private User mockUser;
    private Student mockStudent;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(studentActionRestController).build();

        mockStudent = new Student();
        mockStudent.setId(1);

        mockUser = new User();
        mockUser.setId(10);
        mockUser.setEmail("student@test.com");
        mockUser.setStudent(mockStudent);

        authentication = new UsernamePasswordAuthenticationToken("student@test.com", "password");
    }

    @Test
    void testApplyJob_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

        mockMvc.perform(post("/api/student/jobs/5/apply")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));

        verify(applicationService).applyForJob(1, 5);
    }

    @Test
    void testCancelApply_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

        mockMvc.perform(delete("/api/student/jobs/5/apply")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));

        verify(applicationService).cancelApplication(1, 5);
    }

    @Test
    void testSaveJob_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

        mockMvc.perform(post("/api/student/jobs/5/save")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));

        verify(savedJobService).saveJob(1, 5);
    }

    @Test
    void testGetSavedJobs_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        when(savedJobService.getSavedJobs(anyInt())).thenReturn(List.of());

        mockMvc.perform(get("/api/student/jobs/saved")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testGetMyApplications_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        when(applicationService.getApplicationsByStudent(anyInt())).thenReturn(List.of());

        mockMvc.perform(get("/api/student/applications")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testGetNotifications_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        when(notificationService.getNotificationsByUser(anyInt())).thenReturn(List.of());

        mockMvc.perform(get("/api/student/notifications")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }
}
