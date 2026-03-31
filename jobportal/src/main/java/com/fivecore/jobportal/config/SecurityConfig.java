package com.fivecore.jobportal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;

import com.fivecore.jobportal.service.auth.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;

/**
 * Cấu hình bảo mật Spring Security.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
            .requestMatchers("/css/**", "/js/**", "/images/**", "/fonts/**", "/favicon.ico", "/static/**", "/uploads/**");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .securityContext(context -> context
                .securityContextRepository(securityContextRepository())
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/jobs/**", "/error").permitAll()
                .requestMatchers("/api/company/**").hasAnyRole("COMPANY")
                .requestMatchers("/api/student/**").hasAnyRole("STUDENT")
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN")
                .anyRequest().authenticated()
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType("application/json");
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"status\": \"error\", \"message\": \"Yêu cầu đăng nhập\", \"code\": \"UNAUTHORIZED\"}");
                })
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.IF_REQUIRED)
            )
            .formLogin(AbstractHttpConfigurer::disable)
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)
                )
                .successHandler((request, response, authentication) -> {
                    // Redirect tới frontend handle việc lấy thông tin user
                    response.sendRedirect("http://localhost:5173/login-success");
                })
            )
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_OK);
                    response.getWriter().write("{\"status\": \"success\", \"message\": \"Đã đăng xuất\"}");
                })
                .permitAll()
            );

        return http.build();
    }
}
