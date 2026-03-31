package com.fivecore.jobportal.dto;

import com.fivecore.jobportal.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailResponse {
    private Integer id;
    private String email;
    private String fullName;
    private String role;
    private boolean active;
    private StudentProfileResponse studentProfile;
    private CompanyResponse companyProfile;
}
