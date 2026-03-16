package com.fivecore.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Thực thể Kỹ năng Công việc - Các kỹ năng được yêu cầu cho một công việc cụ thể.
 */
@Entity
@Table(name = "job_skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;
}
