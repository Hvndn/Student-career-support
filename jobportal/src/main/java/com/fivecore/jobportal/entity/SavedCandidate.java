package com.fivecore.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * Thực thể Ứng Viên Đã Lưu - Hỗ trợ doanh nghiệp lưu lại các ứng viên tiềm năng.
 */
@Entity
@Table(name = "saved_candidates", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"company_id", "student_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedCandidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @CreationTimestamp
    @Column(name = "saved_at", nullable = false, updatable = false)
    private LocalDateTime savedAt;
}
