package com.fivecore.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Thực thể Công việc - Thông tin đăng tuyển từ doanh nghiệp.
 */
@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 100)
    private String industry;

    @Column(length = 100)
    private String level;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false)
    private JobType jobType;

    private Integer quantity;

    @Column(length = 20)
    private String gender;

    @Column(length = 100)
    private String experience;

    @Column(length = 100)
    private String qualification;

    @Column(name = "salary_type", length = 50)
    private String salaryType;

    @Column(name = "min_salary")
    private BigDecimal minSalary;

    @Column(name = "max_salary")
    private BigDecimal maxSalary;

    @Column(length = 100)
    private String region;

    @Column(length = 255)
    private String location;

    private LocalDate deadline;

    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @Builder.Default
    private Integer views = 0;

    @Column(name = "contact_name", length = 255)
    private String contactName;

    @Column(name = "contact_email", length = 100)
    private String contactEmail;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<JobSkill> skills = new ArrayList<>();

    // Quan hệ hỗ trợ DELETE CASCADE
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Application> applications;

    public enum JobType {
        intern, parttime, fulltime, remote, contract
    }

    public enum JobStatus {
        draft, pending, open, closed, archived, rejected
    }
}
