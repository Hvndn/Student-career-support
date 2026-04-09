package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.SavedCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavedCandidateRepository extends JpaRepository<SavedCandidate, Integer> {
    List<SavedCandidate> findByCompanyId(Integer companyId);
    Optional<SavedCandidate> findByCompanyIdAndStudentId(Integer companyId, Integer studentId);
    boolean existsByCompanyIdAndStudentId(Integer companyId, Integer studentId);

    @Modifying
    @Query("DELETE FROM SavedCandidate s WHERE s.student.id = :studentId")
    void deleteByStudentId(@Param("studentId") Integer studentId);

    @Modifying
    @Query("DELETE FROM SavedCandidate s WHERE s.company.id = :companyId")
    void deleteByCompanyId(@Param("companyId") Integer companyId);
}
