package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.JobSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobSkillRepository extends JpaRepository<JobSkill, Integer> {
}
