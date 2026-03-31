package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Integer> {
    java.util.Optional<Skill> findByName(String name);
}
