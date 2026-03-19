package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, Integer> {
    void deleteByStudentIdAndSkillId(Integer studentId, Integer skillId);
}
