package com.fivecore.jobportal.controller.api.student;

import com.fivecore.jobportal.dto.StudentProfileResponse;
import com.fivecore.jobportal.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class StudentProfileMapper {

    public StudentProfileResponse toResponse(User user, Student student, List<Project> projects) {
        return StudentProfileResponse.builder()
                .id(student.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .studentIdStr(student.getStudentIdStr())
                .university(student.getUniversity())
                .major(student.getMajor())
                .graduationYear(student.getGraduationYear())
                .gpa(student.getGpa())
                .totalCredits(student.getTotalCredits())
                .earnedCredits(student.getEarnedCredits())
                .classRank(student.getClassRank())
                .academicYear(student.getAcademicYear())
                .currentTerm(student.getCurrentTerm())
                .bio(student.getBio())
                .phone(student.getPhone())
                .address(student.getAddress())
                .avatarUrl(student.getAvatarUrl())
                .coverImageUrl(student.getCoverImageUrl())
                .videoUrl(student.getVideoUrl())
                .githubUrl(student.getGithubUrl())
                .linkedinUrl(student.getLinkedinUrl())
                .skills(mapSkills(student.getSkills()))
                .educations(mapEducations(student.getEducations()))
                .experiences(mapExperiences(student.getExperiences()))
                .projects(mapProjects(projects))
                .languages(mapLanguages(student.getLanguages()))
                .interests(mapInterests(student.getInterests()))
                .activities(mapActivities(student.getActivities()))
                .certifications(mapCertifications(student.getCertifications()))
                .build();
    }

    private List<StudentProfileResponse.SkillDto> mapSkills(List<StudentSkill> skills) {
        if (skills == null) return List.of();
        return skills.stream().map(s -> StudentProfileResponse.SkillDto.builder()
                .id(s.getSkill().getId())
                .name(s.getSkill().getName())
                .level(s.getLevel() == null ? null : s.getLevel().name())
                .build()).collect(Collectors.toList());
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

    private List<StudentProfileResponse.ExperienceDto> mapExperiences(List<Experience> exps) {
        if (exps == null) return List.of();
        return exps.stream().map(exp -> StudentProfileResponse.ExperienceDto.builder()
                .id(exp.getId())
                .companyName(exp.getCompanyName())
                .jobTitle(exp.getJobTitle())
                .startDate(exp.getStartDate())
                .endDate(exp.getEndDate())
                .description(exp.getDescription())
                .build()).collect(Collectors.toList());
    }

    private List<StudentProfileResponse.ProjectDto> mapProjects(List<Project> projects) {
        if (projects == null) return List.of();
        return projects.stream().map(p -> StudentProfileResponse.ProjectDto.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .repositoryUrl(p.getRepositoryUrl())
                .demoUrl(p.getDemoUrl())
                .techStack(p.getTechStack())
                .role(p.getRole())
                .build()).collect(Collectors.toList());
    }

    private List<StudentProfileResponse.LanguageDto> mapLanguages(List<Language> langs) {
        if (langs == null) return List.of();
        return langs.stream().map(l -> StudentProfileResponse.LanguageDto.builder()
                .id(l.getId())
                .languageName(l.getLanguageName())
                .proficiency(l.getProficiency())
                .certificate(l.getCertificate())
                .build()).collect(Collectors.toList());
    }

    private List<StudentProfileResponse.InterestDto> mapInterests(List<Interest> interests) {
        if (interests == null) return List.of();
        return interests.stream().map(i -> StudentProfileResponse.InterestDto.builder()
                .id(i.getId())
                .name(i.getName())
                .build()).collect(Collectors.toList());
    }

    private List<StudentProfileResponse.ActivityDto> mapActivities(List<Activity> activities) {
        if (activities == null) return List.of();
        return activities.stream().map(a -> StudentProfileResponse.ActivityDto.builder()
                .id(a.getId())
                .name(a.getName())
                .organization(a.getOrganization())
                .role(a.getRole())
                .startDate(a.getStartDate() != null ? a.getStartDate().toString() : null)
                .endDate(a.getEndDate() != null ? a.getEndDate().toString() : null)
                .description(a.getDescription())
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
