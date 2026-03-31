package com.fivecore.jobportal.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO hiển thị trạng thái ứng tuyển.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDto {
    private Integer id;
    private Integer jobId;
    private String jobTitle;
    private String companyName;
    private String studentName;
    private String studentAvatar;
    private Integer matchPercentage; // Tỷ lệ phù hợp (0-100)
    private Integer studentId;
    private String status; // pending, review, suitable, interview, accepted, rejected
    private LocalDateTime appliedAt;
}
