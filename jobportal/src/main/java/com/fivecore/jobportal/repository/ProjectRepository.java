package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findByStudentId(Integer studentId);
}
