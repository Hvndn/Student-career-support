package com.fivecore.jobportal.controller.api.student;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fivecore.jobportal.dto.StudentProfileRequest;
import com.fivecore.jobportal.dto.StudentProfileResponse;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.auth.CertificationService;
import com.fivecore.jobportal.service.auth.ProfileService;
import com.fivecore.jobportal.service.common.StorageService;
import com.fivecore.jobportal.service.interaction.PdfExportService;
import com.fivecore.jobportal.service.auth.CustomOAuth2UserService;
import com.fivecore.jobportal.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import com.fivecore.jobportal.security.JwtTokenProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@WebMvcTest(StudentProfileRestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class StudentProfileRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean private ProfileService profileService;
    @MockBean private PdfExportService pdfExportService;
    @MockBean private StorageService storageService;
    @MockBean private UserRepository userRepository;
    @MockBean private CertificationService certificationService;
    @MockBean private StudentProfileMapper studentProfileMapper;
    @MockBean private JwtTokenProvider jwtTokenProvider;
    @MockBean private UserDetailsService userDetailsService;
    @MockBean private CustomOAuth2UserService customOAuth2UserService;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "student@test.com", roles = "STUDENT")
    @DisplayName("API GET Profile: Thành công")
    void testGetProfileSuccess() throws Exception {
        User user = new User();
        user.setEmail("student@test.com");
        user.setFullName("Student Test");
        Student student = new Student();
        user.setStudent(student);

        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(user));
        when(studentProfileMapper.toResponse(any(), any())).thenReturn(StudentProfileResponse.builder().email("student@test.com").build());

        MvcResult result = mockMvc.perform(get("/api/student/profile")
                        .principal(new UsernamePasswordAuthenticationToken("student@test.com", null, AuthorityUtils.createAuthorityList("ROLE_STUDENT"))))
                .andReturn();
        System.out.println("RESPONSE BODY: ---" + result.getResponse().getContentAsString() + "---");
        System.out.println("RESPONSE STATUS: " + result.getResponse().getStatus());

        mockMvc.perform(get("/api/student/profile")
                        .principal(new UsernamePasswordAuthenticationToken("student@test.com", null, AuthorityUtils.createAuthorityList("ROLE_STUDENT"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("student@test.com"));
    }

    @Test
    @WithMockUser(username = "noapp@test.com", roles = "STUDENT")
    @DisplayName("API GET Profile: Lỗi 404 khi không tìm thấy sinh viên")
    void testGetProfileNotFound() throws Exception {
        when(userRepository.findByEmail("noapp@test.com")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/student/profile")
                        .principal(new UsernamePasswordAuthenticationToken("noapp@test.com", null, AuthorityUtils.createAuthorityList("ROLE_STUDENT"))))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @WithMockUser(username = "student@test.com", roles = "STUDENT")
    @DisplayName("API PUT Profile: Cập nhật thành công")
    void testUpdateProfileSuccess() throws Exception {
        User user = new User();
        Student student = new Student();
        student.setId(10);
        user.setStudent(student);

        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(user));

        StudentProfileRequest request = new StudentProfileRequest();
        request.setFullName("Updated Name");

        mockMvc.perform(put("/api/student/profile")
                        .principal(new UsernamePasswordAuthenticationToken("student@test.com", null, AuthorityUtils.createAuthorityList("ROLE_STUDENT")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Cập nhật thông tin thành công"));

        verify(profileService).updateProfile(eq(10), any());
    }

    @Test
    @WithMockUser(username = "student@test.com", roles = "STUDENT")
    @DisplayName("API PUT Profile: Lỗi 500 khi Service ném lỗi")
    void testUpdateProfileError() throws Exception {
        User user = new User();
        Student student = new Student();
        student.setId(10);
        user.setStudent(student);

        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(user));
        doThrow(new RuntimeException("DB Error")).when(profileService).updateProfile(anyInt(), any());

        mockMvc.perform(put("/api/student/profile")
                        .principal(new UsernamePasswordAuthenticationToken("student@test.com", null, AuthorityUtils.createAuthorityList("ROLE_STUDENT")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new StudentProfileRequest())))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false));
    }
}
