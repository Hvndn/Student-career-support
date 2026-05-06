package com.fivecore.jobportal.service.interaction;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Dịch vụ Email - Chịu trách nhiệm gửi các thông báo qua email.
 * Tuân thủ nguyên tắc "Small and Focused functions".
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Gửi một email văn bản đơn giản.
     * @param to Địa chỉ người nhận
     * @param subject Tiêu đề email
     * @param content Nội dung email
     */
    @org.springframework.scheduling.annotation.Async
    public void sendSimpleEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
        log.info("Đã gửi email thành công tới: {}", to);
    }
}
