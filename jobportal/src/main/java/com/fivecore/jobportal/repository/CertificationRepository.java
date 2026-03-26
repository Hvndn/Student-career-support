package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Certification;
import com.fivecore.jobportal.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Integer> {
    List<Certification> findByStudent(Student student);
    List<Certification> findByStudentId(Integer studentId);
}
