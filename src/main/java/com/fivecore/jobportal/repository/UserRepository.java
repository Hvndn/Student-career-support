package com.fivecore.jobportal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fivecore.jobportal.entity.User;

/**
 * Kho lưu trữ cho thực thể User.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Tìm người dùng theo email.
     */
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
