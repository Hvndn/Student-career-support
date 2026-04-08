package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.PasswordResetToken;
import com.fivecore.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
    Optional<PasswordResetToken> findByToken(String token);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM PasswordResetToken p WHERE p.user.id = :userId")
    void deleteByUserId(@Param("userId") Integer userId);

    @Modifying
    @Transactional
    void deleteByUser(User user);
}
