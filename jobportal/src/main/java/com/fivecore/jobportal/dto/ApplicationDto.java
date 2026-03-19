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
    private String status; // pending, reviewed, accepted, rejected
    private LocalDateTime appliedAt;
}
