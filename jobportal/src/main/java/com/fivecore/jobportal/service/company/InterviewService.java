package com.fivecore.jobportal.service.company;

import com.fivecore.jobportal.entity.Application;
import com.fivecore.jobportal.entity.Interview;
import com.fivecore.jobportal.repository.InterviewRepository;
import com.fivecore.jobportal.service.interaction.EmailService;
import com.fivecore.jobportal.service.interaction.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Dịch vụ Phỏng vấn (US-017).
 * Quản lý lịch phỏng vấn và gửi thông báo email tự động cho sinh viên.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;

    /**
     * Sắp xếp lịch phỏng vấn và gửi email (US-017).
     */
    @Transactional
    public Interview scheduleInterview(Application application, LocalDateTime time, String location) {
        Interview interview = Interview.builder()
                .application(application)
                .interviewDate(time)
                .location(location)
                .status("scheduled")
                .build();

        Interview savedInterview = interviewRepository.save(interview);

        // Cập nhật trạng thái đơn ứng tuyển sang 'interview'
        application.setStatus(com.fivecore.jobportal.entity.Application.ApplicationStatus.interview);

        // Gửi email thông báo
        String studentEmail = application.getStudent().getUser().getEmail();
        String content = "Chào " + application.getStudent().getUser().getFullName() + ",\n\n" +
                "Bạn có một lịch phỏng vấn cho vị trí: " + application.getJob().getTitle() + "\n" +
                "Thời gian: " + time.toString() + "\n" +
                "Địa điểm: " + location + "\n\n" +
                "Chúc bạn có một buổi phỏng vấn thành công!";

        emailService.sendSimpleEmail(studentEmail, "[Student Career] Thông báo lịch phỏng vấn", content);
        
        notificationService.sendNotification(application.getStudent().getUser(), 
            "Thông báo lịch phỏng vấn", content);
        
        log.info("Đã sắp xếp lịch phỏng vấn cho đơn ứng tuyển ID: {}", application.getId());
        return savedInterview;
    }

    /**
     * Lấy danh sách phỏng vấn của sinh viên.
     */
    public java.util.List<Interview> getInterviewsByStudent(Integer studentId) {
        return interviewRepository.findByApplication_Student_Id(studentId);
    }

    /**
     * Lấy danh sách phỏng vấn của doanh nghiệp.
     */
    public java.util.List<Interview> getInterviewsByCompany(Integer companyId) {
        return interviewRepository.findByApplication_Job_Company_Id(companyId);
    }

    /**
     * Hủy lịch phỏng vấn.
     */
    @Transactional
    public void cancelInterview(Integer interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch phỏng vấn"));
        
        interview.setStatus("cancelled");
        interviewRepository.save(interview);

        // Gửi thông báo cho sinh viên
        Application app = interview.getApplication();
        String content = "Chào " + app.getStudent().getUser().getFullName() + ",\n\n" +
                "Lịch phỏng vấn cho vị trí: " + app.getJob().getTitle() + " vào lúc " + 
                interview.getInterviewDate().toString() + " đã bị hủy.\n\n" +
                "Trân trọng!";
        
        notificationService.sendNotification(app.getStudent().getUser(), 
            "Thông báo hủy lịch phỏng vấn", content);
        
        log.info("Đã hủy lịch phỏng vấn ID: {}", interviewId);
    }
}
