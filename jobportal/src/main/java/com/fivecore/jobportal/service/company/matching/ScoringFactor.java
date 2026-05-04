package com.fivecore.jobportal.service.company.matching;

import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.Student;
import java.util.Map;

/**
 * Interface cho các tiêu chí chấm điểm ứng viên.
 */
public interface ScoringFactor {
    /**
     * Tên của tiêu chí (ví dụ: skills, experience).
     */
    String getName();

    /**
     * Tính toán điểm số cho tiêu chí này (trả về giá trị từ 0.0 đến 1.0).
     * @param student Ứng viên
     * @param job Công việc
     * @param details Map để lưu chi tiết giải thích (reasons/breakdown)
     * @return Điểm số chuẩn hóa (0.0 - 1.0)
     */
    double calculate(Student student, Job job, Map<String, Object> details);
}
