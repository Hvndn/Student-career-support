package com.fivecore.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

/**
 * Thực thể Chứng chỉ - Các văn bằng, chứng chỉ năng lực của sinh viên.
 */
@Entity
@Table(name = "certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 255)
    private String organization;

    @Column(name = "issue_date")
    private LocalDate issueDate;
}
