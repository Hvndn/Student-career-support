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
    private String studentCode;

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

    @Column(name = "academic_year")
    private String academicYear;

    @Column(name = "current_term")
    private String currentTerm;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private java.util.List<StudentSkill> skills;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Education> educations;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Experience> experiences;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Application> applications;
}
