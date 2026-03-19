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
    long countByJobCompanyId(Integer companyId);
}
