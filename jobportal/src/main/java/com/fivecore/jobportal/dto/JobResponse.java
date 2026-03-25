package com.fivecore.jobportal.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.time.LocalDate;

/**
 * DTO hiển thị tin tuyển dụng cho sinh viên.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {
    private Integer id;
    private String title;
    private String companyName;
    private String industry;
    private String level;
    private String location;
    private String region;
    private String salaryType;
    private java.math.BigDecimal minSalary;
    private java.math.BigDecimal maxSalary;
    private String jobType;
    private String experience;
    private String qualification;
    private String status;
    private String description;
    private String requirements;
    private String benefits;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate deadline;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private java.time.LocalDateTime postedAt;
    private Integer quantity;
    private String gender;
    private Integer viewsCount;
    private Integer applicantsCount;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private boolean isApplied;
    private java.util.List<String> skills;
}
