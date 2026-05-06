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

    // --- New Fields for Interview Lifecycle & Evaluation ---
    @Column(name = "duration")
    private Integer duration; // Thời lượng phỏng vấn (phút)

    @Column(name = "meeting_link", length = 500)
    private String meetingLink; // Link họp online (Google Meet, Zoom...)

    @Column(name = "interview_round", length = 100)
    private String round; // Vòng 1, Vòng 2, Vòng kỹ thuật...

    @Column(name = "interviewer_email", length = 100)
    private String interviewerEmail;

    @Column(name = "interviewer_phone", length = 20)
    private String interviewerPhone;

    // --- Evaluation Fields ---
    @Column(name = "technical_score")
    private Integer technicalScore;

    @Column(name = "communication_score")
    private Integer communicationScore;

    @Column(name = "problem_solving_score")
    private Integer problemSolvingScore;

    @Column(name = "evaluation_notes", columnDefinition = "TEXT")
    private String evaluationNotes;

    @Column(name = "overall_score")
    private Double overallScore;

    @Column(name = "stage_type", length = 100)
    private String stageType; // HR Screening, Technical Interview, Live Coding, Final Interview...

    @Column(name = "recommendation", length = 50)
    private String recommendation; // PASS, FAIL, CONSIDER

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
