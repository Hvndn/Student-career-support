package com.fivecore.jobportal.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO hiển thị tin tuyển dụng cho sinh viên và form edit doanh nghiệp.
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
    private String description;
    private String requirements;
    private String benefits;
    private String location;
    private String region;
    private String salary;
    private String salaryType;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private String jobType;
    private String status;
    private LocalDate deadline;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private java.time.LocalDateTime postedAt;
    private Integer quantity;
    private String gender;
    private String experience;
    private String qualification;
    private Integer viewsCount;
    private Integer applicantsCount;
    private Integer applicantsTodayCount;
    private Integer pendingApplicantsCount;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private boolean isApplied;
    @com.fasterxml.jackson.annotation.JsonProperty("isSaved")
    private boolean isSaved;

    @com.fasterxml.jackson.annotation.JsonProperty("isSaved")
    public boolean getIsSaved() {
        return isSaved;
    }
    private String imageUrl;
    private String bannerUrl;
    private List<String> skills;
    private List<String> companyImages;
    private Integer companyId;
    private String companySize;
    private String website;
}

