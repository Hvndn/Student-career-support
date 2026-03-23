package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.Skill;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.StudentSkill;
import com.fivecore.jobportal.repository.SkillRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.repository.StudentSkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Dịch vụ Quản lý Kỹ năng (US-003 & US-010).
 * Chịu trách nhiệm quản lý danh mục kỹ năng hệ thống và kỹ năng của sinh viên.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SkillService {

    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final StudentRepository studentRepository;

    /**
     * Lấy toàn bộ kỹ năng có sẵn trong hệ thống.
     */
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    /**
     * Cập nhật kỹ năng cho sinh viên.
     * @param studentId ID sinh viên
     * @param skillId ID kỹ năng
     * @param level Trình độ (Beginner, Intermediate, Advanced)
     */
    @Transactional
    public void addSkillToStudent(Integer studentId, Integer skillId, StudentSkill.SkillLevel level) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kỹ năng"));

        // Kiểm tra xem đã có kỹ năng này chưa
        if (student.getSkills() == null) {
            student.setSkills(new java.util.ArrayList<>());
        }
        StudentSkill studentSkill = student.getSkills().stream()
                .filter(ss -> ss.getSkill().getId().equals(skillId))
                .findFirst().orElse(null);

        if (studentSkill != null) {
            log.info("Cập nhật trình độ kỹ năng cho sinh viên {}: {} -> {}", studentId, skill.getName(), level);
            studentSkill.setLevel(level);
        } else {
            studentSkill = StudentSkill.builder()
                    .student(student)
                    .skill(skill)
                    .level(level)
                    .build();
        }

        studentSkillRepository.save(studentSkill);
        log.info("Đã lưu kỹ năng {} cho sinh viên {}", skill.getName(), studentId);
    }

    /**
     * Thêm kỹ năng mới vào hệ thống (Dành cho Admin - US-010).
     */
    @Transactional
    public Skill createNewSkill(String name, String category) {
        if (skillRepository.findByName(name).isPresent()) {
            throw new RuntimeException("Kỹ năng này đã tồn tại trong danh mục");
        }

        Skill skill = Skill.builder()
                .name(name)
                .category(category)
                .build();
        
        return skillRepository.save(skill);
    }

    /**
     * Sửa tên/loại Kỹ năng (US-014).
     */
    @Transactional
    public void updateSkill(Integer id, String name, String category) {
        Skill skill = skillRepository.findById(id).orElseThrow(() -> new RuntimeException("Kỹ năng không tồn tại"));
        if (!skill.getName().equals(name) && skillRepository.findByName(name).isPresent()) {
            throw new RuntimeException("Tên kỹ năng đã tồn tại");
        }
        skill.setName(name);
        skill.setCategory(category);
        skillRepository.save(skill);
    }

    /**
     * Xóa Kỹ năng (US-014).
     */
    @Transactional
    public void deleteSkill(Integer id) {
        skillRepository.deleteById(id);
    }

    /**
     * Xóa Kỹ năng của sinh viên.
     */
    @Transactional
    public void removeSkillFromStudent(Integer studentId, Integer skillId) {
        studentSkillRepository.deleteByStudentIdAndSkillId(studentId, skillId);
        log.info("Đã xóa kỹ năng ID {} cho sinh viên {}", skillId, studentId);
    }
}
