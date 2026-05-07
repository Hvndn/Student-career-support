package com.fivecore.jobportal.service.company.matching;

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
        String cvData = student.getCvData();
        boolean hasExperiences = false;

        if (cvData != null && !cvData.isBlank()) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(cvData);
                com.fasterxml.jackson.databind.JsonNode expNode = root.get("experiences");
                
                if (expNode != null && expNode.isArray() && expNode.size() > 0) {
                    hasExperiences = true;
                    for (com.fasterxml.jackson.databind.JsonNode node : expNode) {
                        String startStr = node.path("startDate").asText();
                        String endStr = node.path("endDate").asText();
                        
                        try {
                            LocalDate start = !startStr.isBlank() ? LocalDate.parse(startStr.substring(0, 10)) : null;
                            LocalDate end = !endStr.isBlank() ? LocalDate.parse(endStr.substring(0, 10)) : LocalDate.now();
                            if (start != null) {
                                totalYears += ChronoUnit.DAYS.between(start, end) / 365.0;
                            }
                        } catch (Exception e) {
                            // Cố gắng lấy số năm trực tiếp nếu có trường years
                            totalYears += node.path("years").asDouble(0);
                        }
                    }
                }
            } catch (Exception e) {
                // Ignore parsing errors
            }
        }

        int requiredYears = parseRequiredExperience(job.getExperience());
        if (!hasExperiences) {
            details.put("is_missing_data", true);
            details.put("experience_years", 0.0);
            details.put("experience_required", requiredYears);
            details.put("experience_reason", "Ứng viên chưa cập nhật kinh nghiệm làm việc");
            return 0.0;
        }

        double score;
        if (requiredYears == 0) {
            score = 1.0;
        } else {
            if (totalYears >= requiredYears) score = 1.0;
            else if (totalYears >= requiredYears * 0.7) score = 0.7;
            else if (totalYears > 0) score = 0.3;
            else score = 0.0;
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
