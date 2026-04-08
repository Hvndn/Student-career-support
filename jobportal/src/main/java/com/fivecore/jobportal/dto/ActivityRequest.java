package com.fivecore.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityRequest {
    private String name;
    private String organization;
    private String role;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
}
