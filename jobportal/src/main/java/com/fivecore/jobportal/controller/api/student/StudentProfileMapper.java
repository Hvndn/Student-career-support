package com.fivecore.jobportal.controller.api.student;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fivecore.jobportal.dto.StudentProfileResponse;
import com.fivecore.jobportal.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class StudentProfileMapper {

    private final ObjectMapper objectMapper;

    public StudentProfileResponse toResponse(User user, Student student) {
        return StudentProfileResponse.builder()
                .id(student.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .studentIdStr(student.getStudentIdStr())
                .university(student.getUniversity())
                .major(student.getMajor())
                .graduationYear(student.getGraduationYear())
                .gpa(student.getGpa())
                .academicYear(student.getAcademicYear())
                .bio(student.getBio())
                .phone(student.getPhone())
                .address(student.getAddress())
                .avatarUrl(student.getAvatarUrl())
                .coverImageUrl(student.getCoverImageUrl())
                .videoUrl(student.getVideoUrl())
                .githubUrl(student.getGithubUrl())
                .linkedinUrl(student.getLinkedinUrl())
                .educations(mapEducations(student.getEducations()))
                .certifications(mapCertifications(student.getCertifications()))
                .experiences(mapExperiencesFromJson(student.getCvData()))
                .projects(mapProjectsFromJson(student.getCvData()))
                .skills(mapSkillsFromJson(student.getCvData()))
                .cvData(student.getCvData())
                .build();
    }

    private List<StudentProfileResponse.ProjectDto> mapProjectsFromJson(String json) {
        List<StudentProfileResponse.ProjectDto> projects = new ArrayList<>();
        if (json == null || json.isBlank()) return projects;
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode projectsNode = root.get("projects");
            if (projectsNode != null && projectsNode.isArray()) {
                for (JsonNode node : projectsNode) {
                    projects.add(StudentProfileResponse.ProjectDto.builder()
                            .name(node.path("name").asText())
                            .description(node.path("description").asText())
                            .demoUrl(node.path("demoUrl").asText())
                            .build());
                }
            }
        } catch (Exception e) { /* ignore */ }
        return projects;
    }

    private List<StudentProfileResponse.ExperienceDto> mapExperiencesFromJson(String json) {
        List<StudentProfileResponse.ExperienceDto> experiences = new ArrayList<>();
        if (json == null || json.isBlank()) return experiences;
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode expNode = root.get("experiences");
            if (expNode != null && expNode.isArray()) {
                for (JsonNode node : expNode) {
                    experiences.add(StudentProfileResponse.ExperienceDto.builder()
                            .jobTitle(node.path("jobTitle").asText())
                            .companyName(node.path("companyName").asText())
                            .description(node.path("description").asText())
                            .build());
                }
            }
        } catch (Exception e) { /* ignore */ }
        return experiences;
    }

    private List<StudentProfileResponse.SkillDto> mapSkillsFromJson(String json) {
        List<StudentProfileResponse.SkillDto> skills = new ArrayList<>();
        if (json == null || json.isBlank()) return skills;
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode skillsNode = root.get("skills");
            if (skillsNode != null && skillsNode.isArray()) {
                for (JsonNode node : skillsNode) {
                    skills.add(new StudentProfileResponse.SkillDto(
                            node.has("name") ? node.get("name").asText() : node.get("skillName").asText(),
                            node.has("level") ? node.get("level").asText() : "Intermediate"
                    ));
                }
            }
        } catch (Exception e) {
            // Log error or ignore
        }
        return skills;
    }

    private List<StudentProfileResponse.EducationDto> mapEducations(List<Education> edus) {
        if (edus == null) return List.of();
        return edus.stream().map(e -> StudentProfileResponse.EducationDto.builder()
                .id(e.getId())
                .schoolName(e.getSchoolName())
                .major(e.getMajor())
                .degree(e.getDegree())
                .startDate(e.getStartDate())
                .endDate(e.getEndDate())
                .description(e.getDescription())
                .build()).collect(Collectors.toList());
    }

    private List<StudentProfileResponse.CertificationDto> mapCertifications(List<Certification> certs) {
        if (certs == null) return List.of();
        return certs.stream().map(c -> StudentProfileResponse.CertificationDto.builder()
                .id(c.getId())
                .name(c.getName())
                .issuer(c.getIssuer())
                .issueDate(c.getIssueDate() != null ? c.getIssueDate().toString() : null)
                .expirationDate(c.getExpirationDate() != null ? c.getExpirationDate().toString() : null)
                .certificateUrl(c.getCertificateUrl())
                .build()).collect(Collectors.toList());
    }
}