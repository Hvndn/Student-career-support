package com.fivecore.jobportal.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminCompanyUpdateRequest {
    private String fullName;
    private String name;
    private String industry;
    private String website;
    private String phone;
    private String address;
    private String description;
    private String companySize;
    private Integer foundingYear;
    private boolean active;
}
