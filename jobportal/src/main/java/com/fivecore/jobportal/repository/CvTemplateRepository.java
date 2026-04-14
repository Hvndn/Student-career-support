package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.CvTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CvTemplateRepository extends JpaRepository<CvTemplate, Integer> {
    List<CvTemplate> findByIsActiveTrue();
    List<CvTemplate> findByCategory(String category);
    List<CvTemplate> findByLayoutKey(String layoutKey);
}
