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
public class MessageResponse {
    private Integer id;
    private Integer senderId;
    private Integer receiverId;
    private String content;
    private LocalDateTime createdAt;
    private boolean isMine; // True nếu người đang đăng nhập gửi
}
