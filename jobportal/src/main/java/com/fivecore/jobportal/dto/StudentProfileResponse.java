package com.fivecore.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {
    private Integer id;
    private String fullName;
    private String email;
    private String studentIdStr;
    private String university;
    private String major;
    private Integer graduationYear;
    private Double gpa;
    private Integer totalCredits;
    private Integer earnedCredits;
    private String classRank;
    private String academicYear;
    private String currentTerm;
    private String bio;
    private String phone;
    private String address;
    private String avatarUrl;
    private String coverImageUrl;
    private String videoUrl;
    private String githubUrl;
    private String linkedinUrl;
    private List<EducationDto> educations;
    private List<CertificationDto> certifications;
    private String cvData;

    @Data
    @Builder
    public static class EducationDto {
        private Integer id;
        private String schoolName;
        private String major;
        private String degree;
        private LocalDate startDate;
        private LocalDate endDate;
        private String description;
    }

    @Data
    @Builder
    public static class CertificationDto {
        private Integer id;
        private String name;
        private String issuer;
        private String issueDate;
        private String expirationDate;
        private String certificateUrl;
    }
}
