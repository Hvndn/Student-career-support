package com.fivecore.jobportal.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

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
    private String location;
    private String salary;
    private String jobType;
    private String status;
    private String description;
    private LocalDate deadline;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private java.time.LocalDateTime postedAt;
    private Integer quantity;
    private String gender;
    private Integer viewsCount;
    private Integer applicantsCount;
    private Integer applicantsTodayCount;
    private Integer pendingApplicantsCount;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private boolean isApplied;
    private List<String> skills;
}
