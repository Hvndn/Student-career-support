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

    @Query("SELECT i FROM Interview i " +
           "LEFT JOIN FETCH i.application a " +
           "LEFT JOIN FETCH a.job j " +
           "LEFT JOIN FETCH j.company c " +
           "LEFT JOIN FETCH a.student s " +
           "LEFT JOIN FETCH s.user u")
    List<Interview> findAllWithDetails();

    @Modifying
    @Query("DELETE FROM Interview i WHERE i.application.id = :applicationId")
    void deleteByApplicationId(@Param("applicationId") Integer applicationId);
}
