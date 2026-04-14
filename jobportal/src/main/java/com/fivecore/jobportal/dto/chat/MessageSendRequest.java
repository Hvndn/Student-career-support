package com.fivecore.jobportal.dto.chat;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageSendRequest {
    @NotBlank(message = "Nội dung tin nhắn không được để trống")
    private String content;
}
