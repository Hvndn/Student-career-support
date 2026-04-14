package com.fivecore.jobportal.controller.common;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.dto.chat.MessageSendRequest;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.interaction.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse> getConversations(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ApiResponse.success("Success", chatService.getConversations(user.getId())));
    }

    @GetMapping("/messages/{partnerId}")
    public ResponseEntity<ApiResponse> getMessages(Authentication authentication, @PathVariable Integer partnerId) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ApiResponse.success("Success", chatService.getMessagesWithPartner(user.getId(), partnerId)));
    }

    @PostMapping("/messages/{partnerId}")
    public ResponseEntity<ApiResponse> sendMessage(
            Authentication authentication,
            @PathVariable Integer partnerId,
            @Valid @RequestBody MessageSendRequest sendRequest) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(ApiResponse.success("Success", chatService.sendMessage(user.getId(), partnerId, sendRequest)));
    }
}
