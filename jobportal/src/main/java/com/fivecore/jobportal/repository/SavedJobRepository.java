package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Integer> {
    List<SavedJob> findByStudentIdOrderBySavedAtDesc(Integer studentId);
    Optional<SavedJob> findByStudentIdAndJobId(Integer studentId, Integer jobId);
    void deleteByStudentIdAndJobId(Integer studentId, Integer jobId);
}
