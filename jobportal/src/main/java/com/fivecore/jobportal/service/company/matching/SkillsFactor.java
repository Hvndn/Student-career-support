package com.fivecore.jobportal.service.company.matching;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.Student;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class SkillsFactor implements ScoringFactor {
    private final ObjectMapper objectMapper;

    @Override
    public String getName() {
        return "skills";
    }

    @Override
    public double calculate(Student student, Job job, Map<String, Object> details) {
        List<String> jobSkills = job.getSkills().stream()
                .map(js -> js.getSkill().getName().toLowerCase())
                .collect(Collectors.toList());

        if (jobSkills.isEmpty()) {
            details.put("skills_reason", "Công việc không yêu cầu kỹ năng cụ thể");
            return 1.0; // Nếu job không yêu cầu gì thì coi như pass 100% phần này
        }

        List<JsonNode> studentSkillsNodes = getStudentSkillsNodes(student);
        if (studentSkillsNodes.isEmpty()) {
            details.put("skills_reason", "Ứng viên chưa cập nhật kỹ năng");
            return 0.0;
        }

        long matches = 0;
        double weightedMatches = 0;
        List<String> matchedNames = new ArrayList<>();

        for (String js : jobSkills) {
            for (JsonNode sn : studentSkillsNodes) {
                String sName = (sn.has("name") ? sn.get("name").asText() : sn.path("skillName").asText()).toLowerCase();
                if (sName.contains(js) || js.contains(sName)) {
                    matches++;
                    matchedNames.add(sName);
                    String level = sn.path("level").asText("intermediate").toLowerCase();
                    if (level.equals("advanced")) weightedMatches += 1.2;
                    else if (level.equals("beginner")) weightedMatches += 0.8;
                    else weightedMatches += 1.0;
                    break;
                }
            }
        }

        double rawScore = weightedMatches / jobSkills.size();
        double normalizedScore = Math.min(1.0, rawScore);
        
        details.put("skills_match_count", String.format("%d/%d", matches, jobSkills.size()));
        details.put("skills_matched", matchedNames);
        details.put("skills_reason", String.format("Khớp %d/%d kỹ năng yêu cầu", matches, jobSkills.size()));

        return normalizedScore;
    }

    private List<JsonNode> getStudentSkillsNodes(Student student) {
        List<JsonNode> nodes = new ArrayList<>();
        String json = student.getCvData();
        if (json == null || json.isBlank()) return nodes;
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode skillsNode = root.get("skills");
            if (skillsNode != null && skillsNode.isArray()) {
                for (JsonNode node : skillsNode) nodes.add(node);
            }
        } catch (Exception e) {
            log.warn("Lỗi khi parse skills cho student ID {}: {}", student.getId(), e.getMessage());
        }
        return nodes;
    }
}
