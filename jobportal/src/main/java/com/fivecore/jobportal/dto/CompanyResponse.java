package com.fivecore.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {
    private Integer id;
    private Integer userId;
    private String name;
    private String description;
    private String website;
    private String address;
    private String logoUrl;
    private String email;
    private String phone;
    private String industry;
    private String companySize;
    private Integer foundingYear;
    private String taxId;
    private String representative;
    private String province;
    private String city;
    private java.util.List<String> activityImages;
}
