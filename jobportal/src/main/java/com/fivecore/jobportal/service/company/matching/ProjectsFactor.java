package com.fivecore.jobportal.service.company.matching;

import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.Student;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ProjectsFactor implements ScoringFactor {

    @Override
    public String getName() {
        return "projects";
    }

    @Override
    public double calculate(Student student, Job job, Map<String, Object> details) {
        double score = 0;
        int projectCount = student.getProjects() != null ? student.getProjects().size() : 0;
        boolean hasGithub = student.getGithubUrl() != null && !student.getGithubUrl().isBlank();
        if (projectCount == 0 && !hasGithub) {
            details.put("is_missing_data", true);
            details.put("projects_reason", "Ứng viên chưa cập nhật dự án và GitHub");
            return 0.0;
        }

        if (hasGithub) score += 0.4; // 40% điểm factor này cho GitHub
        
        if (projectCount >= 3) score += 0.6;
        else if (projectCount == 2) score += 0.4;
        else if (projectCount == 1) score += 0.2;

        details.put("project_count", projectCount);
        details.put("has_github", hasGithub);
        details.put("projects_reason", String.format("Ứng viên có %d dự án và %s link GitHub", 
                projectCount, hasGithub ? "đã có" : "chưa có"));

        return Math.min(1.0, score);
    }
}
