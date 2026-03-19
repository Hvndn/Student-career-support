package com.fivecore.jobportal.dto;

import com.fivecore.jobportal.entity.Job;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

/**
 * DTO nhận dữ liệu đăng tin từ doanh nghiệp.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {
    
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;
    
    @NotBlank(message = "Mô tả công việc không được để trống")
    private String description;
    private String location;
    private String salary;
    private String jobType; // intern, parttime, fulltime
    private LocalDate deadline;
}
