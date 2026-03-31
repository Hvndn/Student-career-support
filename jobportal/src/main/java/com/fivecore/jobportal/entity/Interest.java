package com.fivecore.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

/**
 * Thực thể Sở thích - Lưu trữ các sở thích cá nhân của sinh viên.
 */
@Entity
@Table(name = "interests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private Student student;

    @Column(nullable = false, length = 100)
    private String name; // Ví dụ: Đọc sách, Chơi bóng đá, Lập trình
}
