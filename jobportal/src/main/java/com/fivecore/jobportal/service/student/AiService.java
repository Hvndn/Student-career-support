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

        // 1. Extraction of keywords (Skills from job requirements only)
        Set<String> requiredSkills = new HashSet<>();
        if (job.getSkills() != null) {
            job.getSkills().forEach(js -> requiredSkills.add(js.getSkill().getName().toLowerCase()));
        }
        if (requiredSkills.isEmpty() && job.getRequirements() != null) {
            String reqs = job.getRequirements().toLowerCase();
            if (reqs.contains("autocad")) requiredSkills.add("autocad");
            if (reqs.contains("sketchup")) requiredSkills.add("sketchup");
            if (reqs.contains("photoshop")) requiredSkills.add("photoshop");
            if (reqs.contains("revit")) requiredSkills.add("revit");
            if (reqs.contains("java")) requiredSkills.add("java");
        }

        // 2. Major Relevance (50%)
        double majorScore = 0;
        if (student.getMajor() != null && job.getIndustry() != null) {
            if (student.getMajor().toLowerCase().contains(job.getIndustry().toLowerCase()) ||
                job.getIndustry().toLowerCase().contains(student.getMajor().toLowerCase())) {
                majorScore = 50;
            }
        }

        // 3. Base score + education
        double baseScore = 40;

        // 4. Total Percentage
        int totalPercentage = (int) (baseScore + majorScore);
        if (totalPercentage > 100) totalPercentage = 100;
        if (totalPercentage < 30) totalPercentage = 30;

        // 5. Generate Feedback
        StringBuilder eval = new StringBuilder();
        if (totalPercentage >= 80) {
            eval.append("Sinh viên có hồ sơ rất ấn tượng và cực kỳ phù hợp với vị trí này. ");
        } else if (totalPercentage >= 60) {
            eval.append("Hồ sơ của sinh viên khá phù hợp với yêu cầu cơ bản. ");
        } else {
            eval.append("Hồ sơ hiện tại còn một số khoảng cách so với kỳ vọng của nhà tuyển dụng. ");
        }

        StringBuilder advice = new StringBuilder();
        if (student.getBio() == null || student.getBio().length() < 50) {
            advice.append("Bạn nên viết lại phần giới thiệu bản thân (Bio) chuyên nghiệp và dài hơn để thể hiện thái độ cầu tiến. ");
        }
        if (!requiredSkills.isEmpty()) {
            advice.append("Nhà tuyển dụng yêu cầu các kỹ năng: ").append(String.join(", ", requiredSkills)).append(". Hãy chuẩn bị kiến thức liên quan. ");
        }

        return AiAnalysisDTO.builder()
                .matchPercentage(totalPercentage)
                .evaluation(eval.toString())
                .advice(advice.toString())
                .build();
    }
}
