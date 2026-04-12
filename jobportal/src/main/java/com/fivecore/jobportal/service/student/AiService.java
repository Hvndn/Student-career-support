package com.fivecore.jobportal.service.student;

import com.fivecore.jobportal.dto.AiAnalysisDTO;
import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiService {

    private final JobRepository jobRepository;
    private final StudentRepository studentRepository;

    public AiAnalysisDTO analyzeMatch(Integer jobId, Integer studentId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // 1. Extraction of keywords (Skills)
        Set<String> requiredSkills = new HashSet<>();
        if (job.getSkills() != null) {
            job.getSkills().forEach(js -> requiredSkills.add(js.getSkill().getName().toLowerCase()));
        }
        // Fallback to text parsing if skill list is empty
        if (requiredSkills.isEmpty() && job.getRequirements() != null) {
            String reqs = job.getRequirements().toLowerCase();
            if (reqs.contains("autocad")) requiredSkills.add("autocad");
            if (reqs.contains("sketchup")) requiredSkills.add("sketchup");
            if (reqs.contains("photoshop")) requiredSkills.add("photoshop");
            if (reqs.contains("revit")) requiredSkills.add("revit");
            if (reqs.contains("it") || reqs.contains("java")) requiredSkills.add("java");
        }

        Set<String> studentSkills = new HashSet<>();
        if (student.getSkills() != null) {
            student.getSkills().forEach(ss -> studentSkills.add(ss.getSkill().getName().toLowerCase()));
        }

        // 2. Calculate Skill Match (40%)
        long matchedCount = requiredSkills.stream().filter(studentSkills::contains).count();
        double skillScore = requiredSkills.isEmpty() ? 40 : (matchedCount * 1.0 / requiredSkills.size()) * 40;

        // 3. Experience Match (30%)
        double expScore = 0;
        int studentExpMonths = 0;
        if (student.getExperiences() != null) {
            for (Experience exp : student.getExperiences()) {
                // Simplified: assuming some months for each exp. In a real app we'd calc dates.
                studentExpMonths += 6; 
            }
        }
        // Logic for experience matching
        if (job.getExperience() == null || job.getExperience().contains("không") || job.getExperience().contains("thực tập")) {
            expScore = 30;
        } else if (studentExpMonths >= 12) {
            expScore = 30;
        } else {
            expScore = (studentExpMonths / 12.0) * 30;
        }

        // 4. Major Relevance (20%)
        double majorScore = 0;
        if (student.getMajor() != null && job.getIndustry() != null) {
            if (student.getMajor().toLowerCase().contains(job.getIndustry().toLowerCase()) ||
                job.getIndustry().toLowerCase().contains(student.getMajor().toLowerCase())) {
                majorScore = 20;
            }
        }

        // 5. Total Percentage
        int totalPercentage = (int) (skillScore + expScore + majorScore + 10); // +10 base/other
        if (totalPercentage > 100) totalPercentage = 100;
        if (totalPercentage < 30) totalPercentage = 30; // Min for "joy"

        // 6. Generate Feedback
        StringBuilder eval = new StringBuilder();
        List<String> missing = requiredSkills.stream()
                .filter(s -> !studentSkills.contains(s))
                .collect(Collectors.toList());

        if (totalPercentage >= 80) {
            eval.append("Sinh viên có hồ sơ rất ấn tượng và cực kỳ phù hợp với vị trí này. ");
        } else if (totalPercentage >= 60) {
            eval.append("Hồ sơ của sinh viên khá phù hợp với yêu cầu cơ bản. ");
        } else {
            eval.append("Hồ sơ hiện tại còn một số khoảng cách so với kỳ vọng của nhà tuyển dụng. ");
        }

        if (!studentSkills.isEmpty()) {
            eval.append("Bạn sở hữu bộ kỹ năng mạnh về ").append(String.join(", ", studentSkills)).append(". ");
        }

        if (!missing.isEmpty()) {
            eval.append("Tuy nhiên, hồ sơ chưa đề cập rõ các kỹ năng: ").append(String.join(", ", missing)).append(". ");
        }

        StringBuilder advice = new StringBuilder();
        if (!missing.isEmpty()) {
            advice.append("Cần bổ sung các kỹ năng ").append(String.join(", ", missing))
                  .append(" vào danh sách kỹ năng nếu bạn đã biết sử dụng. ");
        }
        
        if (student.getBio() == null || student.getBio().length() < 50) {
            advice.append("Bạn nên viết lại phần giới thiệu bản thân (Bio) chuyên nghiệp và dài hơn để thể hiện thái độ cầu tiến. ");
        }

        if (expScore < 20) {
            advice.append("Nên nhấn mạnh thêm các dự án thực tế hoặc đồ án môn học để khẳng định khả năng hỗ trợ công việc ngay lập tức. ");
        }

        return AiAnalysisDTO.builder()
                .matchPercentage(totalPercentage)
                .evaluation(eval.toString())
                .advice(advice.toString())
                .build();
    }
}
