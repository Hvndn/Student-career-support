package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Integer> {
    List<Language> findByStudentId(Integer studentId);
}
