package com.fivecore.jobportal.dto;

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
    private String location;
    private String salary;
    private String jobType;
    private String status;
    private String description;
    private LocalDate deadline;
    private boolean isApplied;
}
