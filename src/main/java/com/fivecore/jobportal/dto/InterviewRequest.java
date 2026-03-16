package com.fivecore.jobportal.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO nhận dữ liệu đặt lịch phỏng vấn.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewRequest {
    private Integer applicationId;
    private LocalDateTime interviewDate;
    private String location;
    private String notes;
}
