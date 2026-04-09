package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.PasswordResetRequest;
import com.fivecore.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordResetRequestRepository extends JpaRepository<PasswordResetRequest, Integer> {
    List<PasswordResetRequest> findByStatus(PasswordResetRequest.RequestStatus status);
    List<PasswordResetRequest> findByUserAndStatus(User user, PasswordResetRequest.RequestStatus status);
}
