package com.fivecore.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewEvaluationRequest {
    private Integer technicalScore;
    private Integer communicationScore;
    private Integer problemSolvingScore;
    private String evaluationNotes;
    private String result; // PASS, FAIL, CONSIDER, NEXT_ROUND
    private String recommendation; // PASS, FAIL, CONSIDER
}
