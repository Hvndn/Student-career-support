package com.fivecore.jobportal.controller.api.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fivecore.jobportal.dto.admin.AdminStudentCreateRequest;
import com.fivecore.jobportal.repository.CategoryRepository;
import com.fivecore.jobportal.repository.SkillRepository;
import com.fivecore.jobportal.service.admin.AdminService;
import com.fivecore.jobportal.service.auth.PasswordResetService;
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

import java.util.HashMap;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminRestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AdminRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean private SkillRepository skillRepository;
    @MockBean private CategoryRepository categoryRepository;
    @MockBean private AdminService adminService;
    @MockBean private PasswordResetService passwordResetService;
    @MockBean private JwtTokenProvider jwtTokenProvider;
    @MockBean private UserDetailsService userDetailsService;
    @MockBean private CustomOAuth2UserService customOAuth2UserService;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("API Admin: Lấy thống kê Dashboard")
    void testGetStatisticsSuccess() throws Exception {
        when(adminService.getSystemStatistics()).thenReturn(new HashMap<>());

        mockMvc.perform(get("/api/admin/statistics")
                        .principal(new UsernamePasswordAuthenticationToken("admin@test.com", null, AuthorityUtils.createAuthorityList("ROLE_ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("API Admin: Tạo sinh viên mới - Thành công")
    void testCreateStudentSuccess() throws Exception {
        AdminStudentCreateRequest req = new AdminStudentCreateRequest();
        req.setEmail("new@student.com");

        doNothing().when(adminService).createStudentFromAdmin(any());

        mockMvc.perform(post("/api/admin/create-student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Thêm sinh viên mới thành công"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("API Admin: Tạo sinh viên mới - Lỗi 400 khi email trùng")
    void testCreateStudentFail() throws Exception {
        doThrow(new RuntimeException("Email already exists")).when(adminService).createStudentFromAdmin(any());

        mockMvc.perform(post("/api/admin/create-student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AdminStudentCreateRequest())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.errorCode").value("CREATE_ERROR"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("API Admin: Xóa người dùng - Thành công")
    void testDeleteUserSuccess() throws Exception {
        doNothing().when(adminService).deleteUser(1);

        mockMvc.perform(delete("/api/admin/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Xóa người dùng thành công"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("API Admin: Cập nhật trạng thái Job")
    void testReviewJobStatus() throws Exception {
        mockMvc.perform(post("/api/admin/jobs/100/status")
                        .param("status", "APPROVED"))
                .andExpect(status().isOk());

        verify(adminService).reviewJobPost(eq(100), eq("APPROVED"));
    }
}
