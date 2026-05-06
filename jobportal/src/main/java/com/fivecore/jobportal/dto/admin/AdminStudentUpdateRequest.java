package com.fivecore.jobportal.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStudentUpdateRequest {
    private String fullName;
    private String studentIdStr;
    private String major;
    private String studentClass;
    private String phone;
    private boolean active;
}
