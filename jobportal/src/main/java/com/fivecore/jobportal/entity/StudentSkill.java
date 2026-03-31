package com.fivecore.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

/**
 * Thực thể Kỹ năng Sinh viên - Bảng liên kết sinh viên và kỹ năng kém trình độ.
 */
@Entity
@Table(name = "student_skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    private SkillLevel level;

    public enum SkillLevel {
        beginner, intermediate, advanced
    }
}
