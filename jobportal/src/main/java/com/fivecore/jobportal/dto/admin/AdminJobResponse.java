package com.fivecore.jobportal.dto.admin;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminJobResponse {
    private Integer id;
    private String title;
    private String companyName;
    private LocalDateTime createdAt;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private String status;
    private String description;
    private String requirements;
    private String benefits;
    private String jobType;
    private String location;
    private String industry;
}
