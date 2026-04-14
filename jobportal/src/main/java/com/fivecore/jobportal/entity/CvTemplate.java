package com.fivecore.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Thực thể Mẫu CV - Lưu trữ thông tin về các mẫu thiết kế CV có sẵn.
 */
@Entity
@Table(name = "cv_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String category; // Vd: Chuyên nghiệp, Hiện đại, Đơn giản, ATS...

    @Column(name = "layout_key", nullable = false, length = 50)
    private String layoutKey; // Khóa định danh để map với React Component bên frontend

    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl; // Đường dẫn đến ảnh xem trước

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(length = 255)
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
