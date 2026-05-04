package com.fivecore.jobportal.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminInterviewResponse {
    private Integer id;
    private String companyName;
    private String companyLogo;
    private String industry;
    private String department;
    private String studentName;
    private String studentEmail;
    private String studentAvatar;
    private String studentIdStr;
    private String major;
    private String phone;
    private LocalDateTime interviewDate;
    private String location;
    private String notes;
    private String status;
}
