package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Interest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterestRepository extends JpaRepository<Interest, Integer> {
    List<Interest> findByStudentId(Integer studentId);
}
