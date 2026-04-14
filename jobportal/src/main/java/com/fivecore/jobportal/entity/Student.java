package com.fivecore.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

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
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "student_code", length = 20, unique = true)
    private String studentIdStr;

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

    @Column(name = "cover_url", length = 255)
    private String coverImageUrl;

    @Column(name = "video_url", length = 255)
    private String videoUrl;

    private java.time.LocalDate dob;

    @Column(name = "github_url", length = 255)
    private String githubUrl;

    @Column(name = "linkedin_url", length = 255)
    private String linkedinUrl;

    @Column(length = 20)
    private String phone;

    @Column(name = "gpa")
    private Double gpa;

    @Column(name = "total_credits")
    private Integer totalCredits;

    @Column(name = "earned_credits")
    private Integer earnedCredits;

    @Column(name = "class_rank")
    private String classRank;

    @Column(name = "academic_year", length = 20)
    private String academicYear;

    @Column(name = "current_term", length = 20)
    private String currentTerm;

    @Column(length = 255)
    private String address;

    @Column(name = "cv_data", columnDefinition = "LONGTEXT")
    private String cvData;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @Builder.Default
    private java.util.List<Education> educations = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Application> applications;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private java.util.List<Certification> certifications = new java.util.ArrayList<>();

    // Các bảng tham chiếu để hỗ trợ DELETE CASCADE
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private java.util.List<SavedJob> savedJobs;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private java.util.List<SavedCandidate> savedByCompanies;
}
