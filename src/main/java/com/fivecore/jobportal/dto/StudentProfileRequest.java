package com.fivecore.jobportal.dto;

import lombok.*;

/**
 * DTO cập nhật thông tin học vấn và kinh nghiệm.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileRequest {
    private String university;
    private String major;
    private Integer graduationYear;
    private String introduction;
}
