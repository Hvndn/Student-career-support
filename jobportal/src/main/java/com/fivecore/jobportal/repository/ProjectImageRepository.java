package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.ProjectImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectImageRepository extends JpaRepository<ProjectImage, Integer> {
}
