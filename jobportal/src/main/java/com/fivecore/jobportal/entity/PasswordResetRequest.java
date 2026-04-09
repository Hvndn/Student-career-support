package com.fivecore.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fivecore.jobportal.entity.User;

/**
 * Thực thể Yêu cầu Cấp lại Mật khẩu.
 * Lưu trữ các yêu cầu từ người dùng để Admin phê duyệt.
 */
@Entity
@Table(name = "password_reset_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime requestDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    public enum RequestStatus {
        PENDING, COMPLETED
    }
}
