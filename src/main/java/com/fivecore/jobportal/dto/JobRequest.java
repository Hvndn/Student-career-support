package com.fivecore.jobportal.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO nhận dữ liệu đăng tin từ doanh nghiệp.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {
    
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;
    
    @NotBlank(message = "Mô tả công việc không được để trống")
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
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private String region;
    private String location;
    private LocalDate deadline;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private String status;
    private List<String> skills;
}
