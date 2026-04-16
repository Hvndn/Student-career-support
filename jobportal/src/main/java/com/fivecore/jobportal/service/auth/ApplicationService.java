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
    public ApplicationDto applyForJob(Integer studentId, Integer jobId, String fullName, String email, String phone, String coverLetter, String cvUrl) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tuyển dụng"));

        if (applicationRepository.findByStudentIdAndJobId(studentId, jobId).isPresent()) {
            throw new RuntimeException("Bạn đã ứng tuyển công việc này rồi");
        }

        Application application = Application.builder()
                .student(student)
                .job(job)
                .status(Application.ApplicationStatus.pending)
                .appliedAt(LocalDateTime.now())
                .coverLetter(coverLetter)
                .cvUrl(cvUrl)
                .fullName(fullName)
                .email(email)
                .phone(phone)
                .build();

        Application savedApp = applicationRepository.save(application);
        log.info("Sinh viên {} đã ứng tuyển vào vị trí {} với CV: {}", student.getUser().getFullName(), job.getTitle(), cvUrl);

        // Bắn thông báo nội sinh cho Student (US-019)
        notificationService.sendNotification(student.getUser(),
                "Ứng tuyển thành công",
                "Hồ sơ của bạn đã được chuyển tới " + job.getCompany().getName());

        return mapToDto(savedApp);
    }

    private com.fivecore.jobportal.dto.ApplicationDto mapToDto(Application app) {
        Job job = app.getJob();
        String salaryRange = "Thỏa thuận";
        if (job.getMinSalary() != null && job.getMaxSalary() != null) {
            salaryRange = String.format("%d - %d triệu", job.getMinSalary().intValue(), job.getMaxSalary().intValue());
        } else if (job.getMinSalary() != null) {
            salaryRange = String.format("Từ %d triệu", job.getMinSalary().intValue());
        }

        java.util.List<String> skills = job.getSkills().stream()
                .map(js -> js.getSkill().getName())
                .collect(java.util.stream.Collectors.toList());

        return com.fivecore.jobportal.dto.ApplicationDto.builder()
                .id(app.getId())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .jobType(job.getJobType() != null ? job.getJobType().name() : "intern")
                .jobLocation(job.getLocation())
                .companyName(job.getCompany().getName())
                .companyLogoUrl(job.getCompany().getLogoUrl())
                .companyId(job.getCompany().getId())
                .companyUserId(job.getCompany().getUser().getId())
                .studentName(app.getStudent().getUser().getFullName())
                .studentAvatar(app.getStudent().getAvatarUrl())
                .studentId(app.getStudent().getId())
                .matchPercentage(85) // Giả lập tỷ lệ phù hợp
                .status(app.getStatus().name())
                .appliedAt(app.getAppliedAt())
                .salaryRange(salaryRange)
                .skills(skills)
                .coverLetter(app.getCoverLetter())
                .cvUrl(app.getCvUrl())
                // Snapshot Data with Fallback to current profile
                .fullName(app.getFullName() != null ? app.getFullName() : app.getStudent().getUser().getFullName())
                .email(app.getEmail() != null ? app.getEmail() : app.getStudent().getUser().getEmail())
                .phone(app.getPhone() != null ? app.getPhone() : app.getStudent().getPhone())
                .build();
    }

    /**
     * Lấy toàn bộ danh sách đơn ứng tuyển của một doanh nghiệp.
     */
    public List<ApplicationDto> getApplicationsByCompany(Integer companyId) {
        return applicationRepository.findByJobCompanyIdOrderByAppliedAtDesc(companyId).stream()
                .map(this::mapToDto)
                .collect(java.util.stream.Collectors.toList());
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
        
        // Gửi thông báo cho ứng viên
        String title = "Cập nhật đơn ứng tuyển";
        String message = "Đơn ứng tuyển của bạn vào vị trí " + application.getJob().getTitle() + " đã được cập nhật.";

        switch (status) {
            case accepted:
                title = "Chúc mừng! Đơn ứng tuyển được chấp nhận";
                message = "Hồ sơ của bạn cho vị trí " + application.getJob().getTitle() + " đã được " + application.getJob().getCompany().getName() + " chấp nhận. Vui lòng chuẩn bị cho các bước tiếp theo.";
                break;
            case rejected:
                title = "Kết quả đơn ứng tuyển";
                message = "Cảm ơn bạn đã quan tâm. Rất tiếc, hồ sơ của bạn cho vị trí " + application.getJob().getTitle() + " chưa phù hợp tại thời điểm này.";
                break;
            case suitable:
                title = "Hồ sơ phù hợp";
                message = "Hồ sơ của bạn được đánh giá là phù hợp với vị trí " + application.getJob().getTitle() + ". Doanh nghiệp sẽ sớm liên hệ với bạn.";
                break;
            case interview:
                title = "Mời phỏng vấn";
                message = "Bạn có một lịch hẹn phỏng vấn cho vị trí " + application.getJob().getTitle() + ". Vui lòng kiểm tra email hoặc danh sách lịch phỏng vấn.";
                break;
            case review:
                title = "Đang xem xét hồ sơ";
                message = "Hồ sơ của bạn đang được " + application.getJob().getCompany().getName() + " xem xét kỹ hơn cho vị trí " + application.getJob().getTitle() + ".";
                break;
            default:
                break;
        }

        if (status != Application.ApplicationStatus.pending) {
            notificationService.sendNotification(application.getStudent().getUser(), title, message);
        }
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
     * Hủy đơn ứng tuyển theo jobId + studentId (US-008).
     */
    @Transactional
    public void cancelApplication(Integer studentId, Integer jobId) {
        Application application = applicationRepository.findByStudentIdAndJobId(studentId, jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển"));

        if (!application.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền hủy đơn ứng tuyển này");
        }

        if (application.getStatus() != Application.ApplicationStatus.pending) {
            throw new RuntimeException("Chỉ có thể hủy khi đơn đang ở trạng thái chờ duyệt (pending)");
        }

        applicationRepository.delete(application);
        log.info("Sinh viên ID {} đã hủy đơn ứng tuyển vị trí job ID {}", studentId, jobId);
    }
}
