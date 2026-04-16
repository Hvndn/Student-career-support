package com.fivecore.jobportal.controller.api.student;

import com.fivecore.jobportal.dto.StudentProfileResponse;
import com.fivecore.jobportal.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class StudentProfileMapper {

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
                .educations(mapEducations(student.getEducations()))
                .certifications(mapCertifications(student.getCertifications()))
                .build();
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
x