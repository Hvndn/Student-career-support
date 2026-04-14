package com.fivecore.jobportal.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {
    private Integer partnerId;
    private String partnerName;
    private String partnerRole;
    private String partnerAvatar; // Can be extracted from Student / Company if needed
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private boolean isUnread; // Optional feature
}
