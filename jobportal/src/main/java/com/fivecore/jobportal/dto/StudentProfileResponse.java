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
    private List<SkillDto> skills;
    private List<EducationDto> educations;
    private List<ExperienceDto> experiences;
    private List<ProjectDto> projects;
    private List<LanguageDto> languages;
    private List<InterestDto> interests;
    private List<ActivityDto> activities;
    private List<CertificationDto> certifications;

    @Data
    @Builder
    public static class SkillDto {
        private Integer id;
        private String name;
        private String level;
    }

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
    public static class ExperienceDto {
        private Integer id;
        private String companyName;
        private String jobTitle;
        private LocalDate startDate;
        private LocalDate endDate;
        private String description;
    }

    @Data
    @Builder
    public static class ProjectDto {
        private Integer id;
        private String name;
        private String description;
        private String repositoryUrl;
        private String demoUrl;
        private String techStack;
        private String role;
    }

    @Data
    @Builder
    public static class LanguageDto {
        private Integer id;
        private String languageName;
        private String proficiency;
        private String certificate;
    }

    @Data
    @Builder
    public static class InterestDto {
        private Integer id;
        private String name;
    }

    @Data
    @Builder
    public static class ActivityDto {
        private Integer id;
        private String name;
        private String organization;
        private String role;
        private String startDate;
        private String endDate;
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
