package com.fivecore.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Thực thể Hình ảnh Dự án - Các liên kết hình ảnh minh họa cho dự án.
 */
@Entity
@Table(name = "project_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "image_url", nullable = false, length = 255)
    private String imageUrl;
}
