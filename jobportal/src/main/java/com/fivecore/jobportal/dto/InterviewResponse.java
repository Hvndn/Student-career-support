package com.fivecore.jobportal.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO trả về thông tin phỏng vấn tinh gọn (Fix lỗi ByteBuddyInterceptor).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResponse {
    private Integer id;
    private LocalDateTime interviewDate;
    private String location;
    private String notes;
    private String status;
    private String result;
    private Integer applicationId;
    private Integer studentId;
    private String studentName;
    private String studentEmail;
    private String studentAvatar;
    private String jobTitle;
    private String companyName;
    private String companyLogo;
    private String companyEmail;
    private String interviewerInfo;
    private String requiredDocuments;
    private String interviewFormat;
    private String preliminaryContent;
}
