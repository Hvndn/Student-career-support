package com.fivecore.jobportal.service.interaction;

import com.fivecore.jobportal.entity.Notification;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Dịch vụ Thông báo (US-019).
 * Quản lý việc gửi và xem thông báo trong ứng dụng.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Gửi thông báo tới một người dùng nhất định.
     */
    @Transactional
    public void sendNotification(User user, String title, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .isRead(false)
                .build();
        
        notificationRepository.save(notification);
        log.info("Đã gửi thông báo mới tới người dùng: {}", user.getEmail());
    }

    /**
     * Lấy danh sách thông báo của người dùng.
     */
    public List<Notification> getNotificationsByUser(Integer userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Đánh dấu thông báo đã đọc.
     */
    @Transactional
    public void markAsRead(Integer notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }
}
