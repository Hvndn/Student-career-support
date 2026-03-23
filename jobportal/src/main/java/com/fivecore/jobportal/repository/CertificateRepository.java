package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Integer> {
}
