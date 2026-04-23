package com.fivecore.jobportal.controller.api.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fivecore.jobportal.dto.LoginRequest;
import com.fivecore.jobportal.dto.RegisterRequest;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.DailyStatRepository;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.security.JwtTokenProvider;
import com.fivecore.jobportal.service.auth.PasswordResetService;
import com.fivecore.jobportal.service.auth.RegisterService;
import com.fivecore.jobportal.service.auth.CustomOAuth2UserService;
import com.fivecore.jobportal.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.core.userdetails.UserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthRestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean private RegisterService registerService;
    @MockBean private PasswordResetService passwordResetService;
    @MockBean private AuthenticationManager authenticationManager;
    @MockBean private JwtTokenProvider jwtTokenProvider;
    @MockBean private UserDetailsService userDetailsService;
    @MockBean private CustomOAuth2UserService customOAuth2UserService;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean private UserRepository userRepository;
    @MockBean private DailyStatRepository dailyStatRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("API Auth: Đăng ký thành công")
    void testRegisterSuccess() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("new@test.com");
        req.setPassword("password");
        req.setFullName("Full Name");

        when(registerService.register(any())).thenReturn(true);

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đăng ký thành công"));
    }

    @Test
    @DisplayName("API Auth: Đăng nhập thành công (Giả lập)")
    void testLoginSuccess() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@test.com");
        req.setPassword("pass");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtTokenProvider.generateToken(any())).thenReturn("fake-jwt-token");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(User.builder().fullName("Test User").role(User.Role.student).build()));
        when(dailyStatRepository.findById(any())).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").value("fake-jwt-token"));
    }

    @Test
    @WithMockUser(username = "me@test.com")
    @DisplayName("API Auth: Lấy thông tin user hiện tại (Me)")
    void testGetMeSuccess() throws Exception {
        User user = new User();
        user.setEmail("me@test.com");
        user.setFullName("Me Test");
        user.setRole(User.Role.student);

        when(userRepository.findByEmail("me@test.com")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/auth/me")
                        .principal(new UsernamePasswordAuthenticationToken("me@test.com", null, AuthorityUtils.createAuthorityList("ROLE_STUDENT"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("me@test.com"));
    }
}
