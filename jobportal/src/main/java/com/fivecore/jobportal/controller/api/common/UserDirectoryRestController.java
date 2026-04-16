package com.fivecore.jobportal.controller.api.common;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.dto.chat.ConversationResponse;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * API để lấy danh bạ người dùng (Admins & Companies) cho thanh Sidebar nhắn tin.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserDirectoryRestController {

    private final UserRepository userRepository;

    @GetMapping("/directory")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getDirectory() {
        // Lấy tất cả Admin và Công ty đang hoạt động
        List<User> messageableUsers = userRepository.findAll().stream()
                .filter(u -> u.isActive() && (u.getRole() == User.Role.admin || u.getRole() == User.Role.company))
                .collect(Collectors.toList());

        List<ConversationResponse> directory = messageableUsers.stream().map(u -> {
            String avatarUrl = null;
            if (u.getRole() == User.Role.company && u.getCompany() != null) {
                avatarUrl = u.getCompany().getLogoUrl();
            }
            // Admin thường không có avatar riêng trong thực thể hiện tại, 
            // có thể lấy icon mặc định ở frontend nếu null.

            return ConversationResponse.builder()
                    .partnerId(u.getId())
                    .partnerName(u.getFullName())
                    .partnerRole(u.getRole().name())
                    .partnerAvatar(avatarUrl)
                    .lastMessage("") // Default for new contacts
                    .isUnread(false)
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Lấy danh bạ thành công", directory));
    }
}
