package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    Optional<Application> findByStudentIdAndJobId(Integer studentId, Integer jobId);
    List<Application> findByStudentIdOrderByAppliedAtDesc(Integer studentId);
    List<Application> findByJobIdOrderByAppliedAtDesc(Integer jobId);
    List<Application> findByJobCompanyIdOrderByAppliedAtDesc(Integer companyId);
    long countByJobCompanyId(Integer companyId);
    long countByJobId(Integer jobId);
    long countByJobCompanyIdAndStatus(Integer companyId, Application.ApplicationStatus status);
    long countByJobCompanyIdAndAppliedAtAfter(Integer companyId, java.time.LocalDateTime appliedAt);
    long countByJobIdAndAppliedAtAfter(Integer jobId, java.time.LocalDateTime appliedAt);
    long countByJobIdAndStatus(Integer jobId, com.fivecore.jobportal.entity.Application.ApplicationStatus status);
    boolean existsByJobCompanyIdAndStudentId(Integer companyId, Integer studentId);
}

