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

    /**
     * Gửi một email văn bản đơn giản.
     * @param to Địa chỉ người nhận
     * @param subject Tiêu đề email
     * @param content Nội dung email
     */
    public void sendSimpleEmail(String to, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("Tung_2251220254@dau.edu.vn");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            mailSender.send(message);
            log.info("Đã gửi email thành công tới: {}", to);
        } catch (Exception e) {
            log.error("Lỗi khi gửi email tới {}: {}", to, e.getMessage());
            // Trong môi trường development, ta chỉ log lỗi thay vì throw exception để không dừng luồng chính
        }
    }
}
