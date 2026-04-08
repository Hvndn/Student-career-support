package com.fivecore.jobportal.controller.api.student;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fivecore.jobportal.dto.*;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.auth.*;
import com.fivecore.jobportal.service.common.StorageService;
import com.fivecore.jobportal.service.interaction.PdfExportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class StudentProfileRestControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private SkillService skillService;
    @Mock
    private ProjectService projectService;
    @Mock
    private ProfileService profileService;
    @Mock
    private PdfExportService pdfExportService;
    @Mock
    private StorageService storageService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private LanguageService languageService;
    @Mock
    private InterestService interestService;
    @Mock
    private ActivityService activityService;
    @Mock
    private CertificationService certificationService;
    @Mock
    private StudentProfileMapper studentProfileMapper;

    @InjectMocks
    private StudentProfileRestController studentProfileRestController;

    private User mockUser;
    private Student mockStudent;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(studentProfileRestController).build();
        objectMapper.findAndRegisterModules();

        mockStudent = new Student();
        mockStudent.setId(1);
        mockStudent.setStudentIdStr("SV001");

        mockUser = new User();
        mockUser.setId(1);
        mockUser.setEmail("student@test.com");
        mockUser.setStudent(mockStudent);

        authentication = new UsernamePasswordAuthenticationToken("student@test.com", "password");
    }

    @Test
    void testGetProfile_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        when(projectService.getProjectsByStudent(anyInt())).thenReturn(List.of());
        when(studentProfileMapper.toResponse(any(), any(), any())).thenReturn(StudentProfileResponse.builder().id(1).build());

        mockMvc.perform(get("/api/student/profile")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    void testGetProfile_NotFound() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/student/profile")
                .principal(authentication))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("error"));
    }

    @Test
    void testUpdateProfile_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        StudentProfileRequest request = new StudentProfileRequest();
        request.setFullName("Nguyen Van A");

        mockMvc.perform(put("/api/student/profile")
                .principal(authentication)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));

        verify(profileService).updateProfile(eq(1), any(StudentProfileRequest.class));
    }

    @Test
    void testAddEducation_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        EducationRequest request = new EducationRequest();
        request.setSchoolName("Test Univ");
        request.setMajor("IT");
        request.setStartDate(LocalDate.now().minusYears(4));

        mockMvc.perform(post("/api/student/profile/educations")
                .principal(authentication)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testAddExperience_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        ExperienceRequest request = new ExperienceRequest();
        request.setCompanyName("Company X");
        request.setJobTitle("Developer");
        request.setStartDate(LocalDate.now().minusYears(1));

        mockMvc.perform(post("/api/student/profile/experiences")
                .principal(authentication)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testAddSkill_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        SkillAddRequest request = new SkillAddRequest();
        request.setSkillId(10);
        request.setLevel("INTERMEDIATE");

        mockMvc.perform(post("/api/student/profile/skills")
                .principal(authentication)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testDeleteSkill_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

        mockMvc.perform(delete("/api/student/profile/skills/5")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));

        verify(skillService).removeSkillFromStudent(1, 5);
    }

    @Test
    void testAddLanguage_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        LanguageRequest request = new LanguageRequest();
        request.setLanguageName("Tiếng Anh");
        request.setProficiency("Intermediate");

        mockMvc.perform(post("/api/student/profile/languages")
                .principal(authentication)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testDeleteLanguage_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

        mockMvc.perform(delete("/api/student/profile/languages/3")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));

        verify(languageService).deleteLanguage(3, 1);
    }

    @Test
    void testAddInterest_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        InterestRequest request = new InterestRequest();
        request.setName("Du lịch");

        mockMvc.perform(post("/api/student/profile/interests")
                .principal(authentication)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testDeleteInterest_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

        mockMvc.perform(delete("/api/student/profile/interests/2")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));

        verify(interestService).deleteInterest(2, 1);
    }

    @Test
    void testAddProject_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        ProjectRequest request = new ProjectRequest();
        request.setName("My Portfolio Website");

        mockMvc.perform(post("/api/student/profile/projects")
                .principal(authentication)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testDeleteProject_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

        mockMvc.perform(delete("/api/student/profile/projects/7")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testAddCertification_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        CertificationRequest request = new CertificationRequest();
        request.setName("AWS Certified");

        mockMvc.perform(post("/api/student/profile/certifications")
                .principal(authentication)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testDeleteCertification_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

        mockMvc.perform(delete("/api/student/profile/certifications/4")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testAddActivity_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        ActivityRequest request = new ActivityRequest();
        request.setName("Mùa hè xanh 2024");

        mockMvc.perform(post("/api/student/profile/activities")
                .principal(authentication)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testDeleteActivity_Success() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

        mockMvc.perform(delete("/api/student/profile/activities/8")
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testUpdateAvatar_EmptyFile_ReturnsBadRequest() throws Exception {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

        mockMvc.perform(multipart("/api/student/profile/avatar")
                .file("avatarFile", new byte[0])
                .principal(authentication))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"));
    }
}

