package com.fivecore.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.ToString;
import lombok.EqualsAndHashCode;

/**
 * Thực thể Sinh viên - Chứa thông tin chi tiết của người dùng có vai trò là
 * sinh viên.
 */
@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "student", "company"})
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Column(name = "student_code", length = 20, unique = true)
    private String studentIdStr;
    @Column(name = "class_name", length = 50)
    private String studentClass;

    @Column(length = 255)
    private String university;

    @Column(length = 255)
    private String major;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    @Column(name = "resume_url", length = 255)
    private String resumeUrl;

    private java.time.LocalDate dob;

    @Column(name = "github_url", length = 255)
    private String githubUrl;

    @Column(name = "linkedin_url", length = 255)
    private String linkedinUrl;

    @Column(length = 20)
    private String phone;

    @Column(name = "gpa")
    private Double gpa;

    @Column(length = 255)
    private String address;

    @Column(name = "cv_data", columnDefinition = "LONGTEXT")
    private String cvData;


    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @Builder.Default
    private java.util.List<Project> projects = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Application> applications;


    // Các bảng tham chiếu để hỗ trợ DELETE CASCADE
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private java.util.List<SavedJob> savedJobs;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private java.util.List<SavedCandidate> savedByCompanies;
}
