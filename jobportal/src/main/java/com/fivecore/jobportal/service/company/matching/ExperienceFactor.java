package com.fivecore.jobportal.service.company.matching;

import com.fivecore.jobportal.entity.Experience;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.Student;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@Component
public class ExperienceFactor implements ScoringFactor {

    @Override
    public String getName() {
        return "experience";
    }

    @Override
    public double calculate(Student student, Job job, Map<String, Object> details) {
        double totalYears = 0;
        if (student.getExperiences() != null) {
            for (Experience exp : student.getExperiences()) {
                LocalDate start = exp.getStartDate();
                LocalDate end = exp.getEndDate() != null ? exp.getEndDate() : LocalDate.now();
                if (start != null) {
                    totalYears += ChronoUnit.DAYS.between(start, end) / 365.0;
                }
            }
        }

        int requiredYears = parseRequiredExperience(job.getExperience());
        double score = 0;

        if (requiredYears == 0) {
            score = 1.0; // Không yêu cầu kinh nghiệm
        } else {
            if (totalYears >= requiredYears) score = 1.0;
            else if (totalYears >= requiredYears * 0.7) score = 0.7;
            else if (totalYears > 0) score = 0.3;
            else score = 0.0;
        }

        // Kiểm tra độ tương đồng vị trí (Bonus)
        boolean roleMatch = student.getExperiences() != null && student.getExperiences().stream()
                .anyMatch(exp -> {
                    String title = exp.getJobTitle().toLowerCase();
                    String jobTitle = job.getTitle().toLowerCase();
                    return title.contains(jobTitle) || jobTitle.contains(title);
                });
        
        if (roleMatch && score < 1.0) {
            score = Math.min(1.0, score + 0.2); // Cộng thêm điểm nếu đã từng làm vị trí tương đương
        }

        details.put("experience_years", Math.round(totalYears * 10) / 10.0);
        details.put("experience_required", requiredYears);
        details.put("experience_reason", String.format("Kinh nghiệm thực tế: %.1f năm / Yêu cầu: %d năm", totalYears, requiredYears));

        return score;
    }

    private int parseRequiredExperience(String expStr) {
        if (expStr == null || expStr.isEmpty()) return 0;
        String numeric = expStr.replaceAll("[^0-9]", "");
        return numeric.isEmpty() ? 0 : Integer.parseInt(numeric);
    }
}
