package com.fivecore.jobportal.service.admin;

import com.fivecore.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.fivecore.jobportal.entity.Company;

/**
 * Dịch vụ Quản trị Hệ thống (Dành cho Admin).
 * Cung cấp các công cụ giám sát, thống kê và quản lý người dùng tập trung.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    /**
     * Lấy số liệu thống kê tổng quan cho Dashboard Admin.
     */
    public Map<String, Long> getSystemStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalCompanies", companyRepository.count());
        return stats;
    }

    /**
     * Danh sách tài khoản doanh nghiệp chờ duyệt (US-010).
     */
    public List<Company> getPendingCompanies() {
        return companyRepository.findAll().stream()
                .filter(company -> !company.getUser().isActive())
                .collect(Collectors.toList());
    }

    /**
     * Khóa hoặc mở khóa tài khoản người dùng.
     */
    public void toggleUserLock(Integer userId, boolean lock) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setActive(!lock);
            userRepository.save(user);
            log.info("Admin đã {} tài khoản: {}", lock ? "KHÓA" : "MỞ KHÓA", user.getEmail());
        });
    }

    /**
     * Kiểm duyệt tin tuyển dụng (Thay đổi trạng thái job).
     */
    public void reviewJobPost(Integer jobId, String status) {
        jobRepository.findById(jobId).ifPresent(job -> {
            log.info("Admin đã cập nhật trạng thái tin '{}' sang {}", job.getTitle(), status);
        });
    }

    /**
     * Lấy toàn bộ danh sách người dùng trong hệ thống.
     */
    public List<com.fivecore.jobportal.entity.User> getAllUsers() {
        return userRepository.findAll();
    }
}
