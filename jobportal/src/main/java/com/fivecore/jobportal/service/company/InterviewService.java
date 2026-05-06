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
    public Interview scheduleInterview(Application application, com.fivecore.jobportal.dto.InterviewRequest request) {
        Interview interview = Interview.builder()
                .application(application)
                .interviewDate(request.getInterviewDate())
                .location(request.getLocation())
                .notes(request.getNotes())
                .interviewerInfo(request.getInterviewerInfo())
                .interviewerEmail(request.getInterviewerEmail())
                .interviewerPhone(request.getInterviewerPhone())
                .requiredDocuments(request.getRequiredDocuments())
                .interviewFormat(request.getInterviewFormat())
                .preliminaryContent(request.getPreliminaryContent())
                .duration(request.getDuration())
                .meetingLink(request.getMeetingLink())
                .round(request.getRound())
                .stageType(request.getStageType() != null ? request.getStageType() : "Technical Interview")
                .status("scheduled")
                .build();

        Interview savedInterview = interviewRepository.save(interview);

        // Cập nhật trạng thái đơn ứng tuyển sang 'interview'
        application.setStatus(com.fivecore.jobportal.entity.Application.ApplicationStatus.interview);

        // Gửi email và thông báo chi tiết
        String studentEmail = application.getStudent().getUser().getEmail();
        String studentName = application.getStudent().getUser().getFullName();
        String companyName = application.getJob().getCompany().getName();
        String jobTitle = application.getJob().getTitle();
        String interviewDateStr = request.getInterviewDate().toString().replace("T", " ");
        
        StringBuilder messageBuilder = new StringBuilder();
        messageBuilder.append("Chào ").append(studentName).append(",\n\n");
        messageBuilder.append("Chúc mừng! Công ty ").append(companyName).append(" đã đặt lịch phỏng vấn với bạn cho vị trí ").append(jobTitle).append(".\n\n");
        messageBuilder.append("📍 Hình thức: ").append(request.getInterviewFormat()).append("\n");
        messageBuilder.append("📅 Thời gian: ").append(interviewDateStr).append("\n");
        if (request.getDuration() != null) {
            messageBuilder.append("⏳ Thời lượng dự kiến: ").append(request.getDuration()).append(" phút\n");
        }
        messageBuilder.append("🏢 Địa điểm/Link: ").append(request.getMeetingLink() != null && !request.getMeetingLink().isEmpty() ? request.getMeetingLink() : request.getLocation()).append("\n");
        if (request.getRound() != null) {
            messageBuilder.append("🏷 Vòng phỏng vấn: ").append(request.getRound()).append("\n");
        }
        
        if (request.getInterviewerInfo() != null && !request.getInterviewerInfo().isEmpty()) {
            messageBuilder.append("👤 Người phỏng vấn: ").append(request.getInterviewerInfo()).append("\n");
        }
        
        if (request.getRequiredDocuments() != null && !request.getRequiredDocuments().isEmpty()) {
            messageBuilder.append("📁 Hồ sơ cần mang theo: ").append(request.getRequiredDocuments()).append("\n");
        }
        
        if (request.getNotes() != null && !request.getNotes().isEmpty()) {
            messageBuilder.append("\n📝 Ghi chú từ nhà tuyển dụng: ").append(request.getNotes()).append("\n");
        }
        
        messageBuilder.append("\nChúc bạn có một buổi phỏng vấn thành công!\nTrân trọng,\nĐội ngũ Fivecore.");

        String fullContent = messageBuilder.toString();

        emailService.sendSimpleEmail(studentEmail, "[Fivecore] Thông báo lịch phỏng vấn - " + companyName, fullContent);
        
        notificationService.sendNotification(application.getStudent().getUser(), 
            "Lịch phỏng vấn mới từ " + companyName, "Bạn có lịch phỏng vấn cho vị trí " + jobTitle + " vào lúc " + interviewDateStr);
        
        return savedInterview;
    }

    /**
     * Lấy danh sách phỏng vấn của sinh viên.
     */
    public java.util.List<Interview> getInterviewsByStudent(Integer studentId) {
        return interviewRepository.findByStudentIdWithDetails(studentId);
    }

    /**
     * Lấy danh sách phỏng vấn của doanh nghiệp.
     */
    public java.util.List<Interview> getInterviewsByCompany(Integer companyId) {
        return interviewRepository.findByCompanyIdWithDetails(companyId);
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
        String companyName = app.getJob().getCompany().getName();
        String jobTitle = app.getJob().getTitle();
        
        String content = "Chào " + app.getStudent().getUser().getFullName() + ",\n\n" +
                "Rất tiếc, Công ty " + companyName + " vừa thông báo hủy lịch phỏng vấn cho vị trí " + jobTitle + 
                " vào lúc " + interview.getInterviewDate().toString().replace("T", " ") + ".\n\n" +
                "Vui lòng kiểm tra lại danh sách ứng tuyển hoặc liên hệ với nhà tuyển dụng để biết thêm chi tiết.\n" +
                "Trân trọng!";
        
        notificationService.sendNotification(app.getStudent().getUser(), 
            "Thông báo hủy lịch phỏng vấn - " + companyName, "Lịch phỏng vấn vị trí " + jobTitle + " đã bị hủy.");
        
        log.info("Đã hủy lịch phỏng vấn ID: {}", interviewId);
    }

    /**
     * Cập nhật lịch phỏng vấn.
     */
    @Transactional
    public void updateInterview(Integer id, com.fivecore.jobportal.dto.InterviewRequest request) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch phỏng vấn"));

        interview.setInterviewDate(request.getInterviewDate());
        interview.setLocation(request.getLocation());
        interview.setNotes(request.getNotes());
        interview.setInterviewerInfo(request.getInterviewerInfo());
        interview.setRequiredDocuments(request.getRequiredDocuments());
        interview.setInterviewFormat(request.getInterviewFormat());
        interview.setPreliminaryContent(request.getPreliminaryContent());
        interview.setDuration(request.getDuration());
        interview.setMeetingLink(request.getMeetingLink());
        interview.setRound(request.getRound());
        interview.setInterviewerEmail(request.getInterviewerEmail());
        interview.setInterviewerPhone(request.getInterviewerPhone());
        interview.setStageType(request.getStageType());

        if (request.getStatus() != null) {
            interview.setStatus(request.getStatus());
        }
        
        interviewRepository.save(interview);
        log.info("Đã cập nhật lịch phỏng vấn ID: {}", id);
    }

    /**
     * Cập nhật trạng thái phỏng vấn nhanh (US-017 mở rộng).
     */
    @Transactional
    public void updateInterviewStatus(Integer id, String status) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch phỏng vấn"));
        interview.setStatus(status);
        interviewRepository.save(interview);
        log.info("Đã cập nhật trạng thái phỏng vấn ID {} sang {}", id, status);
    }

    /**
     * Ghi nhận đánh giá sau phỏng vấn và tự động cập nhật Application (US-017 MVP).
     */
    @Transactional
    public void submitEvaluation(Integer id, com.fivecore.jobportal.dto.InterviewEvaluationRequest request) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch phỏng vấn"));

        interview.setTechnicalScore(request.getTechnicalScore());
        interview.setCommunicationScore(request.getCommunicationScore());
        interview.setProblemSolvingScore(request.getProblemSolvingScore());
        interview.setEvaluationNotes(request.getEvaluationNotes());
        interview.setResult(request.getResult());
        interview.setRecommendation(request.getRecommendation());
        
        // Luôn chuyển sang completed khi đã đánh giá
        interview.setStatus("completed");

        // Trọng số Hardcoded: Technical 50%, Communication 20%, Problem Solving 30%
        double overall = (request.getTechnicalScore() * 0.5) + 
                         (request.getCommunicationScore() * 0.2) + 
                         (request.getProblemSolvingScore() * 0.3);
        
        interview.setOverallScore(Math.round(overall * 10) / 10.0);

        interviewRepository.save(interview);

        // Tự động cập nhật Application Status dựa trên Kết quả (PASS/FAIL)
        Application app = interview.getApplication();
        String result = request.getResult() != null ? request.getResult().toUpperCase() : "";
        
        String title = "Kết quả phỏng vấn - " + app.getJob().getCompany().getName();
        String message = "";

        if ("PASS".equals(result)) {
            app.setStatus(Application.ApplicationStatus.passed);
            message = "Chúc mừng! Bạn đã vượt qua vòng phỏng vấn cho vị trí " + app.getJob().getTitle() + ". Chúng tôi sẽ sớm gửi thông tin Offer cho bạn.";
        } else if ("FAIL".equals(result)) {
            app.setStatus(Application.ApplicationStatus.rejected);
            message = "Cảm ơn bạn đã quan tâm đến vị trí " + app.getJob().getTitle() + ". Rất tiếc, chúng tôi chưa thể đồng hành cùng bạn tại thời điểm này.";
        }

        if (!message.isEmpty()) {
            notificationService.sendNotification(app.getStudent().getUser(), title, message);
        }

        log.info("Đã đánh giá phỏng vấn ID {} với kết quả {}", id, result);
    }

    /**
     * Sinh viên xác nhận tham gia phỏng vấn.
     */
    @Transactional
    public void confirmInterview(Integer id, Integer studentId) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch phỏng vấn"));
        
        if (!interview.getApplication().getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền xác nhận lịch phỏng vấn này");
        }

        if ("confirmed".equals(interview.getStatus())) {
            throw new RuntimeException("Lịch phỏng vấn này đã được xác nhận trước đó");
        }

        interview.setStatus("confirmed");
        interviewRepository.save(interview);

        // Thông báo cho nhà tuyển dụng
        Application app = interview.getApplication();
        com.fivecore.jobportal.entity.User companyUser = app.getJob().getCompany().getUser();
        String studentName = app.getStudent().getUser().getFullName();
        String jobTitle = app.getJob().getTitle();

        notificationService.sendNotification(companyUser, 
            "Ứng viên xác nhận phỏng vấn", 
            "Ứng viên " + studentName + " đã xác nhận tham gia buổi phỏng vấn cho vị trí " + jobTitle + 
            " vào lúc " + interview.getInterviewDate().toString().replace("T", " "));

        log.info("Sinh viên ID {} đã xác nhận lịch phỏng vấn ID {}", studentId, id);
    }

    /**
     * Sinh viên từ chối tham gia phỏng vấn.
     */
    @Transactional
    public void rejectInterview(Integer id, Integer studentId, String reason) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch phỏng vấn"));
        
        if (!interview.getApplication().getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền từ chối lịch phỏng vấn này");
        }

        interview.setStatus("cancelled"); // Hoặc dùng "rejected" tùy database của bạn
        interview.setNotes(interview.getNotes() + "\n[Sinh viên từ chối]: " + (reason != null ? reason : "Không có lý do"));
        interviewRepository.save(interview);

        // Thông báo cho nhà tuyển dụng
        Application app = interview.getApplication();
        com.fivecore.jobportal.entity.User companyUser = app.getJob().getCompany().getUser();
        String studentName = app.getStudent().getUser().getFullName();
        String jobTitle = app.getJob().getTitle();

        notificationService.sendNotification(companyUser, 
            "Ứng viên từ chối phỏng vấn", 
            "Ứng viên " + studentName + " đã từ chối buổi phỏng vấn cho vị trí " + jobTitle + 
            (reason != null && !reason.isEmpty() ? ". Lý do: " + reason : "."));

        log.info("Sinh viên ID {} đã từ chối lịch phỏng vấn ID {}", studentId, id);
    }

    /**
     * Lấy chi tiết lịch phỏng vấn.
     */
    public Interview getInterview(Integer id) {
        return interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch phỏng vấn"));
    }
}
