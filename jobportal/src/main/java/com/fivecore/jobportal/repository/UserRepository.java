package com.fivecore.jobportal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fivecore.jobportal.entity.User;

/**
 * Kho lưu trữ cho thực thể User.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    /**
     * Tìm người dùng theo email.
     */
    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u LEFT JOIN FETCH u.company WHERE u.email = :email")
    Optional<User> findByEmailWithCompany(String email);
    
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    java.util.List<User> findByRoleAndIsActive(User.Role role, boolean isActive);
}
