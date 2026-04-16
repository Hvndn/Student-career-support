package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Integer> {
    List<Interview> findByApplication_Student_Id(Integer studentId);

    List<Interview> findByApplication_Job_Company_Id(Integer companyId);

    @Modifying
    @Query("DELETE FROM Interview i WHERE i.application.id = :applicationId")
    void deleteByApplicationId(@Param("applicationId") Integer applicationId);
}
