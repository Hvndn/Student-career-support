package com.fivecore.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

/**
 * Thực thể Ngoại ngữ - Lưu trữ năng lực ngôn ngữ của sinh viên.
 */
@Entity
@Table(name = "languages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private Student student;

    @Column(name = "language_name", nullable = false, length = 100)
    private String languageName;

    @Column(length = 50)
    private String proficiency; // Ví dụ: Sơ cấp, Trung cấp, Cao cấp, Bản ngữ

    @Column(length = 100)
    private String certificate; // Ví dụ: IELTS 7.5, JLPT N3
}
