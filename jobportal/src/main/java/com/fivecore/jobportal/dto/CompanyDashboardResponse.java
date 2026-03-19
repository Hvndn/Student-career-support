package com.fivecore.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDashboardResponse {
    private String fullName;
    private String companyName;
    private List<JobResponse> jobs;
    private long activeJobsCount;
    private long totalCandidatesCount;
    private long pendingInterviewsCount;
    private long profileViewsCount;
    private List<ApplicationDto> recentCandidates;
}
