package com.fivecore.jobportal.service.company;

import com.fivecore.jobportal.dto.StudentProfileResponse;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.StudentRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Dịch vụ Tìm kiếm Ứng viên (US-014).
 * Hỗ trợ doanh nghiệp tìm kiếm sinh viên theo tên, chuyên ngành.
 */
@Service
@RequiredArgsConstructor
public class CandidateSearchService {

    private final StudentRepository studentRepository;

    /**
     * Tìm kiếm sinh viên theo tên hoặc chuyên ngành.
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

            // skill param kept for API compatibility but ignored since student_skills table removed
            if (skill != null && !skill.isEmpty()) {
                String lSkill = "%" + skill.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("major")), lSkill));
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
                .educations(student.getEducations().stream().map(ed ->
                    StudentProfileResponse.EducationDto.builder()
                        .schoolName(ed.getSchoolName())
                        .major(ed.getMajor())
                        .degree(ed.getDegree())
                        .startDate(ed.getStartDate())
                        .endDate(ed.getEndDate())
                        .build()
                ).collect(Collectors.toList()))
                .build();
    }
}
