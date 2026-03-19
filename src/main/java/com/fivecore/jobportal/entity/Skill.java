package com.fivecore.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Thực thể Kỹ năng - Danh mục kỹ năng (Java, SQL, Soft skills,...)
 */
@Entity
@Table(name = "skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100, unique = true)
    private String name;

    @Column(length = 100)
    private String category;
}
