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
import com.fivecore.jobportal.service.company.CandidateMatchingService;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Dịch vụ Quản lý Ứng tuyển (US-007, US-008, US-009, US-018).
 * Xử lý luồng nộp đơn, theo dõi trạng thái và quản lý danh sách ứng viên.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final NotificationService notificationService;
    private final CandidateMatchingService candidateMatchingService;

    public Application getApplicationEntity(Integer id) {
        return applicationRepository.findById(id).orElse(null);
    }

    public ApplicationDto getApplicationDtoById(Integer id) {
        return applicationRepository.findById(id)
                .map(this::mapToDto)
                .orElse(null);
    }

    /**
     * Sinh viên nộp đơn ứng tuyển (US-007).
     */
    @Transactional
    public ApplicationDto applyForJob(Integer studentId, Integer jobId, String fullName, String email, String phone, String coverLetter, String cvUrl, String cvData) {
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
                .cvData(cvData)
                .fullName(fullName)
                .email(email)
                .phone(phone)
                .build();

        Application savedApp = applicationRepository.save(application);
        log.info("Sinh viên {} đã ứng tuyển vào vị trí {} với CV: {}, Data: {}", student.getUser().getFullName(), job.getTitle(), cvUrl, cvData != null ? "Yes" : "No");

        // Bắn thông báo nội sinh cho Student (US-019)
        notificationService.sendNotification(student.getUser(),
                "Ứng tuyển thành công",
                "Hồ sơ của bạn đã được chuyển tới " + job.getCompany().getName());

        return mapToDto(savedApp);
    }

    private Double calculateMatchScore(Application app) {
        if (app.getStudent() == null || app.getJob() == null) return 0.0;
        return candidateMatchingService.calculateDetailedScore(app.getStudent(), app.getJob(), new java.util.HashMap<>());
    }

    private java.util.Map<String, Object> calculateMatchDetails(Application app) {
        if (app.getStudent() == null || app.getJob() == null) return new java.util.HashMap<>();
        java.util.Map<String, Object> details = new java.util.HashMap<>();
        candidateMatchingService.calculateDetailedScore(app.getStudent(), app.getJob(), details);
        return details;
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

        return ApplicationDto.builder()
                .id(app.getId())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .jobType(job.getJobType() != null ? job.getJobType().name() : "intern")
                .jobLocation(job.getLocation())
                .companyName(job.getCompany().getName())
                .companyLogoUrl(job.getBannerUrl() != null ? job.getBannerUrl() : job.getCompany().getLogoUrl())
                .companyId(job.getCompany().getId())
                .companyUserId(job.getCompany().getUser().getId())
                .studentName(app.getStudent().getUser().getFullName())
                .studentAvatar(app.getStudent().getAvatarUrl())
                .studentId(app.getStudent().getId())
                .studentUserId(app.getStudent().getUser().getId())
                .matchScore(calculateMatchScore(app))
                .matchDetails(calculateMatchDetails(app))
                .status(app.getStatus().name())
                .appliedAt(app.getAppliedAt())
                .salaryRange(salaryRange)
                .skills(skills)
                .coverLetter(app.getCoverLetter())
                .cvUrl(app.getCvUrl())
                .cvData(app.getCvData())
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
     * Có kiểm tra quyền sở hữu của doanh nghiệp.
     */
    @Transactional
    public void updateApplicationStatus(Integer applicationId, Application.ApplicationStatus status, Integer companyId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển"));

        // Kiểm tra quyền: Đơn ứng tuyển phải thuộc về công việc của doanh nghiệp đang đăng nhập
        if (!application.getJob().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Bạn không có quyền cập nhật trạng thái cho hồ sơ này");
        }

        application.setStatus(status);
        applicationRepository.save(application);
        log.info("Đã cập nhật trạng thái đơn ứng tuyển ID {} sang {}", applicationId, status);
        
        // Gửi thông báo cho ứng viên
        String title = "Cập nhật đơn ứng tuyển";
        String message = "Đơn ứng tuyển của bạn vào vị trí " + application.getJob().getTitle() + " đã được cập nhật.";

        switch (status) {
            case rejected:
                title = "Kết quả đơn ứng tuyển";
                message = "Cảm ơn bạn đã quan tâm. Rất tiếc, hồ sơ của bạn cho vị trí " + application.getJob().getTitle() + " chưa phù hợp tại thời điểm này.";
                break;
            case interview:
                title = "Mời phỏng vấn";
                message = "Bạn có một lịch hẹn phỏng vấn cho vị trí " + application.getJob().getTitle() + ". Vui lòng kiểm tra email hoặc danh sách lịch phỏng vấn.";
                break;
            case review:
                title = "Đang xem xét hồ sơ";
                message = "Hồ sơ của bạn đang được " + application.getJob().getCompany().getName() + " theo dõi và xem xét thêm cho vị trí " + application.getJob().getTitle() + ".";
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
        java.time.LocalDateTime startOfDay = java.time.LocalDateTime.now().with(java.time.LocalTime.MIN);
        return applicationRepository.findByJobCompanyIdAndAppliedAtAfterOrderByAppliedAtDesc(companyId, startOfDay).stream()
                .limit(3)
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
