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
    private long pendingCount;
    private long reviewCount;
    private long suitableCount;
    private long interviewCount;
    private long acceptedCount;
    private long rejectedCount;
    private long pendingInterviewsCount;
    private long profileViewsCount;
    private long newCandidatesTodayCount;
    private long totalViews;
    private List<java.util.Map<String, Object>> applicationTrends;
    private List<ApplicationDto> recentCandidates;
}
