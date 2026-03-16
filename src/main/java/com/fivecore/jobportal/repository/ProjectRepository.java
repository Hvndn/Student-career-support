package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    java.util.List<Project> findByStudentId(Integer studentId);
}
