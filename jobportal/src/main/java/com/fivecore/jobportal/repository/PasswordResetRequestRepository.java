package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.PasswordResetRequest;
import com.fivecore.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PasswordResetRequestRepository extends JpaRepository<PasswordResetRequest, Integer> {
    List<PasswordResetRequest> findByStatus(PasswordResetRequest.RequestStatus status);
    List<PasswordResetRequest> findByUserAndStatus(User user, PasswordResetRequest.RequestStatus status);
    long countByStatus(PasswordResetRequest.RequestStatus status);

    @Modifying
    @Transactional
    @Query("DELETE FROM PasswordResetRequest p WHERE p.user.id = :userId")
    void deleteByUserId(Integer userId);
}
