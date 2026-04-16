package com.fivecore.jobportal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Cấu hình WebSocket (STOMP) cho tính năng nhắn tin thời gian thực.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Kích hoạt broker nội bộ để quản lý các tin nhắn
        config.enableSimpleBroker("/topic", "/queue", "/user");
        
        // Tiền tố cho các API mà client gửi tới server
        config.setApplicationDestinationPrefixes("/app");
        
        // Tiền tố cho các tin nhắn riêng tư (User-specific)
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Điểm kết nối WebSocket, hỗ trợ SockJS làm fallback
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
        
        // Đăng ký endpoint không có SockJS nếu cần cho các client khác
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }
}
