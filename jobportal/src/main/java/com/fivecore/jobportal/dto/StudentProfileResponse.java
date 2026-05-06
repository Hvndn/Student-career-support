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
    private String studentClass;
    private String university;
    private String major;
    private Integer graduationYear;
    private Double gpa;
    private String bio;
    private String phone;
    private String address;
    private String avatarUrl;
    private String resumeUrl;
    private String githubUrl;
    private String linkedinUrl;
    private List<EducationDto> educations;
    private List<ExperienceDto> experiences;
    private List<ProjectDto> projects;
    private List<CertificationDto> certifications;
    private List<SkillDto> skills;
    private String cvData;
    private Double matchScore; // Tỷ lệ phù hợp (0-100)
    private java.util.Map<String, Object> matchDetails; // Chi tiết chấm điểm

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillDto {
        private String name;
        private String level;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
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
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExperienceDto {
        private Integer id;
        private String jobTitle;
        private String companyName;
        private LocalDate startDate;
        private LocalDate endDate;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectDto {
        private Integer id;
        private String name;
        private String description;
        private String repositoryUrl;
        private String demoUrl;
        private String role;
        private String technologies;
        private String responsibilities;
        private LocalDate startDate;
        private LocalDate endDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificationDto {
        private Integer id;
        private String name;
        private String issuer;
        private String issueDate;
        private String expirationDate;
        private String certificateUrl;
    }
}
