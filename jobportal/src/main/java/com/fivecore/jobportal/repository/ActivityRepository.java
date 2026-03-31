package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Activity;
import com.fivecore.jobportal.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Integer> {
    List<Activity> findByStudent(Student student);
    List<Activity> findByStudentId(Integer studentId);
}
