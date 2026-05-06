package com.fivecore.jobportal.dto;

import lombok.*;

/**
 * DTO cập nhật thông tin học vấn và kinh nghiệm.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileRequest {
    private String fullName;
    private String studentIdStr;
    private String studentClass;
    private String phone;
    private String bio;
    private String university;
    private String major;
    private Integer graduationYear;
    private Double gpa;
    private String address;
    private String githubUrl;
    private String linkedinUrl;
    private String cvData;

}
