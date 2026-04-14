package com.fivecore.jobportal.service.interaction;

import com.fivecore.jobportal.dto.chat.ConversationResponse;
import com.fivecore.jobportal.dto.chat.MessageResponse;
import com.fivecore.jobportal.dto.chat.MessageSendRequest;
import com.fivecore.jobportal.entity.Message;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.MessageRepository;
import com.fivecore.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public List<ConversationResponse> getConversations(Integer userId) {
        List<Message> latestMessages = messageRepository.findLatestConversationsForUser(userId);
        
        return latestMessages.stream().map(msg -> {
            User partner = msg.getSender().getId().equals(userId) ? msg.getReceiver() : msg.getSender();
            String avatarUrl = null;
            if (partner.getRole() == User.Role.student && partner.getStudent() != null) {
                avatarUrl = partner.getStudent().getAvatarUrl();
            } else if (partner.getRole() == User.Role.company && partner.getCompany() != null) {
                avatarUrl = partner.getCompany().getLogoUrl();
            }

            return ConversationResponse.builder()
                    .partnerId(partner.getId())
                    .partnerName(partner.getFullName())
                    .partnerRole(partner.getRole().name())
                    .partnerAvatar(avatarUrl)
                    .lastMessage(msg.getContent())
                    .lastMessageTime(msg.getCreatedAt())
                    .isUnread(false) // Thể hiện sau (có thể dựa trên read_status nếu thêm)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<MessageResponse> getMessagesWithPartner(Integer userId, Integer partnerId) {
        List<Message> messages = messageRepository.findMessagesBetween(userId, partnerId);
        return messages.stream().map(msg -> MessageResponse.builder()
                .id(msg.getId())
                .senderId(msg.getSender().getId())
                .receiverId(msg.getReceiver().getId())
                .content(msg.getContent())
                .createdAt(msg.getCreatedAt())
                .isMine(msg.getSender().getId().equals(userId))
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public MessageResponse sendMessage(Integer senderId, Integer receiverId, MessageSendRequest request) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .build();

        Message savedMsg = messageRepository.save(message);

        return MessageResponse.builder()
                .id(savedMsg.getId())
                .senderId(senderId)
                .receiverId(receiverId)
                .content(savedMsg.getContent())
                .createdAt(savedMsg.getCreatedAt())
                .isMine(true)
                .build();
    }
}
