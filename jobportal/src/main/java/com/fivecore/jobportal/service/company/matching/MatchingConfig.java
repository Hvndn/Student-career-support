package com.fivecore.jobportal.service.company.matching;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Lớp cấu hình trọng số cho Scoring Engine.
 * Cho phép thay đổi trọng số mà không cần sửa code logic.
 */
@Data
@Component
public class MatchingConfig {
    
    // Trọng số mặc định (Total = 1.0)
    private Map<String, Double> weights = new HashMap<>();
    
    public MatchingConfig() {
        weights.put("skills", 0.40);      // 40%
        weights.put("experience", 0.35);  // 35%
        weights.put("projects", 0.15);    // 15%
        weights.put("education", 0.05);   // 5%
        weights.put("location", 0.05);    // 5%
    }

    public double getWeight(String factorName) {
        return weights.getOrDefault(factorName, 0.0);
    }
    
    public boolean isEnabled(String factorName) {
        return weights.containsKey(factorName) && weights.get(factorName) > 0;
    }
}
