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
public class CertificationRequest {
    private String name;
    private String issuer;
    private LocalDate issueDate;
    private LocalDate expirationDate;
    private String certificateUrl;
}
