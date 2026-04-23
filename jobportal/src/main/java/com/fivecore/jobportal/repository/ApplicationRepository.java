package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    Optional<Application> findByStudentIdAndJobId(Integer studentId, Integer jobId);
    List<Application> findByStudentIdOrderByAppliedAtDesc(Integer studentId);
    List<Application> findByJobIdOrderByAppliedAtDesc(Integer jobId);
    List<Application> findByJobCompanyIdOrderByAppliedAtDesc(Integer companyId);
    List<Application> findByJobCompanyIdAndAppliedAtAfterOrderByAppliedAtDesc(Integer companyId, java.time.LocalDateTime appliedAt);
    
    List<Application> findByStudentId(Integer studentId);
    List<Application> findByJobId(Integer jobId);

    @Modifying
    @Query("DELETE FROM Application a WHERE a.student.id = :studentId")
    void deleteByStudentId(@Param("studentId") Integer studentId);

    @Modifying
    @Query("DELETE FROM Application a WHERE a.job.id = :jobId")
    void deleteByJobId(@Param("jobId") Integer jobId);

    long countByJobCompanyId(Integer companyId);
    long countByJobId(Integer jobId);
    long countByJobCompanyIdAndStatus(Integer companyId, Application.ApplicationStatus status);
    long countByJobCompanyIdAndAppliedAtAfter(Integer companyId, java.time.LocalDateTime appliedAt);
    long countByJobIdAndAppliedAtAfter(Integer jobId, java.time.LocalDateTime appliedAt);
    long countByJobIdAndStatus(Integer jobId, com.fivecore.jobportal.entity.Application.ApplicationStatus status);
    boolean existsByJobCompanyIdAndStudentId(Integer companyId, Integer studentId);

    @Query("SELECT FUNCTION('DATE', a.appliedAt) as day, COUNT(a) as count FROM Application a " +
           "WHERE a.job.company.id = :companyId AND a.appliedAt >= :startDate " +
           "GROUP BY FUNCTION('DATE', a.appliedAt) " +
           "ORDER BY FUNCTION('DATE', a.appliedAt) ASC")
    List<Object[]> countApplicationsByDay(@Param("companyId") Integer companyId, @Param("startDate") java.time.LocalDateTime startDate);
    @Query("SELECT FUNCTION('HOUR', a.appliedAt) as h, COUNT(a) as count FROM Application a " +
           "WHERE a.job.company.id = :companyId AND a.appliedAt >= :startDate " +
           "GROUP BY FUNCTION('HOUR', a.appliedAt) " +
           "ORDER BY FUNCTION('HOUR', a.appliedAt) ASC")
    List<Object[]> countApplicationsByHour(@Param("companyId") Integer companyId, @Param("startDate") java.time.LocalDateTime startDate);
}
