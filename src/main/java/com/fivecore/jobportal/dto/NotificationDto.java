package com.fivecore.jobportal.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO cho thông báo hệ thống.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
    private Integer id;
    private String title;
    private String message;
    private LocalDateTime createdAt;
    private boolean isRead;
}
