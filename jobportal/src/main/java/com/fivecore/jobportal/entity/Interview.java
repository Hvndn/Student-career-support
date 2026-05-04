package com.fivecore.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * Thực thể Phỏng vấn - Chi tiết buổi phỏng vấn cho từng đơn ứng tuyển.
 */
@Entity
@Table(name = "interviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Application application;

    @Column(name = "interview_date", nullable = false)
    private LocalDateTime interviewDate;

    @Column(length = 255)
    private String location;

    @Column(length = 100)
    private String department;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(length = 50)
    private String status;

    @Column(length = 50)
    private String result;

    @Column(name = "interviewer_info", length = 255)
    private String interviewerInfo;

    @Column(name = "required_documents", length = 255)
    private String requiredDocuments;

    @Column(name = "interview_format", length = 50)
    private String interviewFormat;

    @Column(name = "preliminary_content", columnDefinition = "TEXT")
    private String preliminaryContent;
}
