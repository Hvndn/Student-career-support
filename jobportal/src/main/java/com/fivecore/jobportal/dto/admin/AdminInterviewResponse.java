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
    private LocalDateTime interviewDate;
    private String notes;
    private String status;
}
