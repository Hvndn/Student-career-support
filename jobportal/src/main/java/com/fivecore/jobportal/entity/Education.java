package com.fivecore.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

import lombok.*;
import java.time.LocalDate;

/**
 * Thực thể Học vấn - Lưu trữ quá trình học tập của sinh viên.
 */
@Entity
@Table(name = "educations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private Student student;


    @Column(name = "school_name", nullable = false, length = 255)
    private String schoolName;

    @Column(nullable = false, length = 255)
    private String major;

    @Column(length = 255)
    private String degree;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(columnDefinition = "TEXT")
    private String description;
}
