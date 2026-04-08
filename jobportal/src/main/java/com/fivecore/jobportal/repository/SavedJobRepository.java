package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Integer> {
    List<SavedJob> findByStudentIdOrderBySavedAtDesc(Integer studentId);

    Optional<SavedJob> findByStudentIdAndJobId(Integer studentId, Integer jobId);

    @Modifying
    @Query("DELETE FROM SavedJob s WHERE s.student.id = :studentId")
    void deleteByStudentId(@Param("studentId") Integer studentId);

    void deleteByStudentIdAndJobId(Integer studentId, Integer jobId);
}
