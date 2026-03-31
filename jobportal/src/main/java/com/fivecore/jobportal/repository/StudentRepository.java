package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer>, JpaSpecificationExecutor<Student> {
    Optional<Student> findByStudentIdStr(String studentIdStr);
}
