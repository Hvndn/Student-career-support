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
    private String jobType;
    private String jobLocation;
    private String companyName;
    private String companyLogoUrl;
    private String studentName;
    private String studentAvatar;
    private Double matchScore; // Tỷ lệ phù hợp (0-100)
    private java.util.Map<String, Object> matchDetails;
    private Integer studentId;
    private Integer studentUserId;
    private String status; // pending, review, suitable, interview, accepted, rejected
    private LocalDateTime appliedAt;

    // Additional fields for Premium UI
    private String salaryRange;
    private java.util.List<String> skills;
    private Integer companyId;
    private Integer companyUserId;
    private String coverLetter;
    private String cvUrl;
    private String cvData;
    private String cvName;

    // Contact info submitted
    private String fullName;
    private String email;
    private String phone;
    private String rejectionReason;
}
