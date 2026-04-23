package com.fivecore.jobportal.controller.api.company;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fivecore.jobportal.dto.JobRequest;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.*;
import com.fivecore.jobportal.service.auth.ApplicationService;
import com.fivecore.jobportal.service.common.StorageService;
import com.fivecore.jobportal.service.company.CompanyService;
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

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CompanyRestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CompanyRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean private CompanyService companyService;
    @MockBean private UserRepository userRepository;
    @MockBean private JobRepository jobRepository;
    @MockBean private ApplicationRepository applicationRepository;
    @MockBean private ApplicationService applicationService;
    @MockBean private SavedCandidateRepository savedCandidateRepository;
    @MockBean private StudentRepository studentRepository;
    @MockBean private CompanyRepository companyRepository;
    @MockBean private StorageService storageService;
    @MockBean private JwtTokenProvider jwtTokenProvider;
    @MockBean private UserDetailsService userDetailsService;
    @MockBean private CustomOAuth2UserService customOAuth2UserService;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "company@test.com", roles = "COMPANY")
    @DisplayName("API Post Job: Đăng tin thành công")
    void testPostJobSuccess() throws Exception {
        User user = new User();
        Company company = new Company();
        company.setId(1);
        user.setCompany(company);

        when(userRepository.findByEmail("company@test.com")).thenReturn(Optional.of(user));

        JobRequest request = new JobRequest();
        request.setTitle("New Tech Job");
        request.setJobType("fulltime");

        mockMvc.perform(post("/api/company/jobs")
                        .principal(new UsernamePasswordAuthenticationToken("company@test.com", null, AuthorityUtils.createAuthorityList("ROLE_COMPANY")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đăng tin tuyển dụng thành công"));

        verify(companyService).postJob(eq(1), any());
    }

    @Test
    @WithMockUser(username = "company@test.com", roles = "COMPANY")
    @DisplayName("API GET Profile: Lấy hồ sơ công ty")
    void testGetProfileSuccess() throws Exception {
        User user = new User();
        user.setRole(User.Role.company);
        Company company = new Company();
        company.setName("Big Corp");
        user.setCompany(company);

        when(userRepository.findByEmail("company@test.com")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/company/profile")
                        .principal(new UsernamePasswordAuthenticationToken("company@test.com", null, AuthorityUtils.createAuthorityList("ROLE_COMPANY"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Big Corp"));
    }
}
