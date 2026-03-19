package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Kho lưu trữ cho thực thể Company.
 */
@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
}
