package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    @Modifying
    @Query("DELETE FROM Message m WHERE m.sender.id = :senderId OR m.receiver.id = :receiverId")
    void deleteBySenderIdOrReceiverId(@Param("senderId") Integer senderId, @Param("receiverId") Integer receiverId);
}
