package com.fivecore.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

/**
 * Thực thể Dự án - Các dự án cá nhân hoặc học thuật của sinh viên.
 */
@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "repository_url", length = 255)
    private String repositoryUrl;

    @Column(name = "demo_url", length = 255)
    private String demoUrl;

    @Column(name = "tech_stack", length = 255)
    private String techStack;

    @Column(length = 255)
    private String role;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectImage> images;
}
