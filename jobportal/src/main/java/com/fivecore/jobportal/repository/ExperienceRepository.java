package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Integer> {
    List<Experience> findByStudentIdOrderByStartDateDesc(Integer studentId);
}
