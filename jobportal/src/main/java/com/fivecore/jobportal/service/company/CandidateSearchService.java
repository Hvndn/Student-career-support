package com.fivecore.jobportal.service.company;

import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Dịch vụ Tìm kiếm Ứng viên (US-014).
 * Hỗ trợ doanh nghiệp tìm kiếm sinh viên theo kỹ năng.
 */
@Service
@RequiredArgsConstructor
public class CandidateSearchService {

    private final StudentRepository studentRepository;

    /**
     * Tìm kiếm sinh viên theo kỹ năng.
     * @param skillName Tên kỹ năng (Java, Python, v.v.)
     */
    public List<Student> searchStudentsBySkill(String skillName) {
        Specification<Student> spec = (root, query, cb) -> {
            if (skillName == null || skillName.isEmpty()) {
                return cb.conjunction();
            }
            // Join với bảng StudentSkill và Skill
            return cb.like(cb.lower(root.join("skills").join("skill").get("name")), 
                           "%" + skillName.toLowerCase() + "%");
        };

        return studentRepository.findAll(spec);
    }
}
