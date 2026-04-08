package com.fivecore.jobportal.service.company;

import com.fivecore.jobportal.dto.StudentProfileResponse;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.StudentRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Dịch vụ Tìm kiếm Ứng viên (US-014).
 * Hỗ trợ doanh nghiệp tìm kiếm sinh viên theo kỹ năng.
 */
@Service
@RequiredArgsConstructor
public class CandidateSearchService {

    private final StudentRepository studentRepository;

    /**
     * Tìm kiếm sinh viên theo các tiêu chí đa dạng.
     * @param query Từ khóa tìm kiếm (tên hoặc chuyên ngành)
     * @param skill Tên kỹ năng (Java, Python, v.v.)
     */
    public List<StudentProfileResponse> searchStudents(String queryStr, String skill) {
        Specification<Student> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (queryStr != null && !queryStr.isEmpty()) {
                String lQuery = "%" + queryStr.toLowerCase() + "%";
                Predicate fullName = cb.like(cb.lower(root.get("user").get("fullName")), lQuery);
                Predicate major = cb.like(cb.lower(root.get("major")), lQuery);
                predicates.add(cb.or(fullName, major));
            }

            if (skill != null && !skill.isEmpty()) {
                Join<Object, Object> studentSkills = root.join("skills");
                Join<Object, Object> skillsTable = studentSkills.join("skill");
                predicates.add(cb.like(cb.lower(skillsTable.get("name")), "%" + skill.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return studentRepository.findAll(spec).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StudentProfileResponse getStudentById(Integer studentId) {
        return studentRepository.findById(studentId)
                .map(this::mapToResponse)
                .orElse(null);
    }

    private StudentProfileResponse mapToResponse(Student student) {
        return StudentProfileResponse.builder()
                .id(student.getId())
                .fullName(student.getUser().getFullName())
                .email(student.getUser().getEmail())
                .studentIdStr(student.getStudentIdStr())
                .university(student.getUniversity())
                .major(student.getMajor())
                .graduationYear(student.getGraduationYear())
                .bio(student.getBio())
                .avatarUrl(student.getAvatarUrl())
                .skills(student.getSkills().stream().map(sk -> 
                    StudentProfileResponse.SkillDto.builder()
                        .name(sk.getSkill() != null ? sk.getSkill().getName() : "N/A")
                        .level(sk.getLevel() != null ? sk.getLevel().name() : "N/A")
                        .build()
                ).collect(Collectors.toList()))
                .educations(student.getEducations().stream().map(ed -> 
                    StudentProfileResponse.EducationDto.builder()
                        .schoolName(ed.getSchoolName())
                        .major(ed.getMajor())
                        .degree(ed.getDegree())
                        .startDate(ed.getStartDate())
                        .endDate(ed.getEndDate())
                        .build()
                ).collect(Collectors.toList()))
                .experiences(student.getExperiences().stream().map(ex -> 
                    StudentProfileResponse.ExperienceDto.builder()
                        .companyName(ex.getCompanyName())
                        .jobTitle(ex.getJobTitle())
                        .startDate(ex.getStartDate())
                        .endDate(ex.getEndDate())
                        .description(ex.getDescription())
                        .build()
                ).collect(Collectors.toList()))
                .projects(student.getProjects().stream().map(pr -> 
                    StudentProfileResponse.ProjectDto.builder()
                        .id(pr.getId())
                        .name(pr.getName())
                        .description(pr.getDescription())
                        .repositoryUrl(pr.getRepositoryUrl())
                        .demoUrl(pr.getDemoUrl())
                        .build()
                ).collect(Collectors.toList()))
                .build();
    }
}
