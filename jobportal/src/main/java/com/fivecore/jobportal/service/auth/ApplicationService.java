package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.dto.ApplicationDto;
import com.fivecore.jobportal.entity.Application;
import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.ApplicationRepository;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fivecore.jobportal.service.interaction.NotificationService;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Dịch vụ Quản lý Ứng tuyển (US-007, US-008, US-009, US-018).
 * Xử lý luồng nộp đơn, theo dõi trạng thái và quản lý danh sách ứng viên.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final NotificationService notificationService;

    public Application getApplicationEntity(Integer id) {
        return applicationRepository.findById(id).orElse(null);
    }

    /**
     * Sinh viên nộp đơn ứng tuyển (US-007).
     */
    @Transactional
    public ApplicationDto applyForJob(Integer studentId, Integer jobId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng"));

        if (applicationRepository.findByStudentIdAndJobId(studentId, jobId).isPresent()) {
            throw new RuntimeException("Bạn đã ứng tuyển công việc này rồi");
        }

        if (student.getSkills() == null || student.getSkills().isEmpty()) {
            throw new RuntimeException("Vui lòng cập nhật Kỹ năng chuyên môn trước khi ứng tuyển.");
        }

        Application application = Application.builder()
                .student(student)
                .job(job)
                .status(Application.ApplicationStatus.pending)
                .appliedAt(LocalDateTime.now())
                .build();

        Application savedApp = applicationRepository.save(application);
        log.info("Sinh viên {} đã ứng tuyển vào vị trí {}", student.getUser().getFullName(), job.getTitle());

        // Bắn thông báo nội sinh cho Student (US-019)
        notificationService.sendNotification(student.getUser(),
                "Ứng tuyển thành công",
                "Hồ sơ của bạn đã được chuyển tới " + job.getCompany().getName());

        return mapToDto(savedApp);
    }

    private com.fivecore.jobportal.dto.ApplicationDto mapToDto(Application app) {
        return com.fivecore.jobportal.dto.ApplicationDto.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .companyName(app.getJob().getCompany().getName())
                .studentName(app.getStudent().getUser().getFullName())
                .status(app.getStatus().name())
                .appliedAt(app.getAppliedAt())
                .build();
    }

    /**
     * Doanh nghiệp phê duyệt/từ chối ứng viên (US-009).
     */
    @Transactional
    public void updateApplicationStatus(Integer applicationId, Application.ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển"));

        application.setStatus(status);
        applicationRepository.save(application);
        log.info("Đã cập nhật trạng thái đơn ứng tuyển ID {} sang {}", applicationId, status);
    }

    /**
     * Lấy danh sách đơn ứng tuyển của một sinh viên (US-008).
     */
    public List<ApplicationDto> getApplicationsByStudent(Integer studentId) {
        return applicationRepository.findByStudentIdOrderByAppliedAtDesc(studentId).stream()
                .map(this::mapToDto)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Lấy danh sách ứng viên của một tin tuyển dụng (US-018).
     */
    public List<ApplicationDto> getApplicantsByJob(Integer jobId) {
        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId).stream()
                .map(this::mapToDto)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Lấy danh sách ứng tuyển mới nhất của một doanh nghiệp.
     */
    public List<ApplicationDto> getRecentApplicationsByCompany(Integer companyId) {
        return applicationRepository.findByJobCompanyIdOrderByAppliedAtDesc(companyId).stream()
                .limit(5)
                .map(this::mapToDto)
                .collect(java.util.stream.Collectors.toList());
    }

    public long countPendingInterviewsByCompany(Integer companyId) {
        return applicationRepository.countByJobCompanyId(companyId);
    }

    /**
     * Hủy đơn ứng tuyển (US-008).
     */
    @Transactional
    public void cancelApplication(Integer applicationId, Integer studentId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển"));

        if (!application.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền hủy đơn ứng tuyển này");
        }

        if (application.getStatus() != Application.ApplicationStatus.pending) {
            throw new RuntimeException("Chỉ có thể hủy đơn ứng tuyển đang ở trạng thái chờ duyệt");
        }

        applicationRepository.delete(application);
        log.info("Sinh viên ID {} đã hủy đơn ứng tuyển ID {}", studentId, applicationId);
    }
}
