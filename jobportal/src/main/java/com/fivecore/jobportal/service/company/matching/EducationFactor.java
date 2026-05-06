package com.fivecore.jobportal.service.company.matching;

import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.Student;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class EducationFactor implements ScoringFactor {

    @Override
    public String getName() {
        return "education";
    }

    @Override
    public double calculate(Student student, Job job, Map<String, Object> details) {
        double score = 0;
        String major = student.getMajor() != null ? student.getMajor().toLowerCase() : "";
        String industry = job.getIndustry() != null ? job.getIndustry().toLowerCase() : "";

        boolean isMajorMissing = major.isEmpty() || major.equals("n/a") || major.equals("chưa cập nhật");
        boolean isGpaMissing = student.getGpa() == null || student.getGpa() == 0;

        if (isMajorMissing && isGpaMissing) {
            details.put("is_missing_data", true);
            details.put("education_reason", "Ứng viên chưa cập nhật thông tin học vấn (Chuyên ngành & GPA)");
            return 0.0;
        } else if (!industry.isEmpty() && !isMajorMissing) {
            if (major.contains(industry) || industry.contains(major)) {
                score = 1.0;
            } else if (isSameCluster(major, industry)) {
                score = 0.7;
            } else {
                score = 0.3;
            }
        } else {
            score = 0.5; // Điểm trung bình nếu thiếu dữ liệu so sánh từ Job
        }
        
        if (student.getGpa() != null && student.getGpa() >= 3.2) {
            score = Math.min(1.0, score + 0.1); // Bonus cho GPA giỏi
        }

        details.put("education_major", student.getMajor());
        details.put("education_reason", String.format("Chuyên ngành %s so với lĩnh vực %s", 
                student.getMajor() != null ? student.getMajor() : "N/A", job.getIndustry() != null ? job.getIndustry() : "N/A"));

        return score;
    }

    private boolean isSameCluster(String major, String industry) {
        if ((major.contains("cntt") || major.contains("công nghệ thông tin") || major.contains("phần mềm") || major.contains("máy tính") || major.contains("it")) && 
            (industry.contains("it") || industry.contains("công nghệ thông tin") || industry.contains("phần mềm") || industry.contains("tech") || industry.contains("phát triển"))) return true;
        
        if ((major.contains("kinh tế") || major.contains("quản trị") || major.contains("marketing") || major.contains("tài chính") || major.contains("kế toán")) && 
            (industry.contains("kinh doanh") || industry.contains("marketing") || industry.contains("tài chính") || industry.contains("dịch vụ") || industry.contains("thương mại"))) return true;

        return false;
    }
}
