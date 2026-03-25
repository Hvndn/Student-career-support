package com.fivecore.jobportal.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fivecore.jobportal.entity.Job;
import lombok.*;
import java.time.LocalDate;

/**
 * DTO nhận dữ liệu đăng tin từ doanh nghiệp.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {
    
    private String title;
    
    private String description;

    private String industry;
    private String level;
    private String requirements;
    private String benefits;
    private String jobType;
    private Integer quantity;
    private String gender;
    private String experience;
    private String qualification;
    private String salaryType;
    private java.math.BigDecimal minSalary;
    private java.math.BigDecimal maxSalary;
    private String region;
    private String location;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate deadline;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    
    private String status;
    private java.util.List<String> skills;
}
