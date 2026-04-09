package com.fivecore.jobportal.controller.api.company;

import com.fivecore.jobportal.dto.ApiResponse;
import com.fivecore.jobportal.dto.StudentProfileResponse;
import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.entity.SavedCandidate;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.User;
import com.fivecore.jobportal.repository.ApplicationRepository;
import com.fivecore.jobportal.repository.CompanyRepository;
import com.fivecore.jobportal.repository.SavedCandidateRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.repository.UserRepository;
import com.fivecore.jobportal.service.company.CandidateSearchService;
import com.fivecore.jobportal.service.interaction.PdfExportService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/company/saved-candidates")
@RequiredArgsConstructor
public class CompanySavedCandidateRestController {

    private final SavedCandidateRepository savedCandidateRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final CandidateSearchService candidateSearchService;
    private final PdfExportService pdfExportService;
    private final ApplicationRepository applicationRepository;

    private Company getCurrentCompany(Authentication authentication) {
        return userRepository.findByEmailWithCompany(authentication.getName())
                .map(User::getCompany)
                .orElse(null);
    }

    @PostMapping("/{studentId}")
    public ResponseEntity<ApiResponse<Object>> saveCandidate(@PathVariable Integer studentId, Authentication authentication) {
        Company company = getCurrentCompany(authentication);
        if (company == null) return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền doanh nghiệp", "FORBIDDEN"));

        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy ứng viên", "NOT_FOUND"));

        if (savedCandidateRepository.findByCompanyIdAndStudentId(company.getId(), studentId).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Ứng viên này đã được lưu", "ALREADY_SAVED"));
        }

        SavedCandidate savedCandidate = SavedCandidate.builder()
                .company(company)
                .student(student)
                .build();
        savedCandidateRepository.save(savedCandidate);

        return ResponseEntity.ok(ApiResponse.success("Lưu ứng viên thành công", null));
    }

    @DeleteMapping("/{studentId}")
    public ResponseEntity<ApiResponse<Object>> unsaveCandidate(@PathVariable Integer studentId, Authentication authentication) {
        Company company = getCurrentCompany(authentication);
        if (company == null) return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền doanh nghiệp", "FORBIDDEN"));

        savedCandidateRepository.findByCompanyIdAndStudentId(company.getId(), studentId).ifPresent(savedCandidateRepository::delete);
        return ResponseEntity.ok(ApiResponse.success("Đã bỏ lưu ứng viên", null));
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Object>> getSavedCandidates(Authentication authentication) {
        Company company = getCurrentCompany(authentication);
        if (company == null) return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền doanh nghiệp", "FORBIDDEN"));

        List<SavedCandidate> list = savedCandidateRepository.findByCompanyId(company.getId());
        
        // Map to a simple DTO to keep it clean
        var result = list.stream().map(sc -> {
            Student s = sc.getStudent();
            User u = s.getUser();
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", sc.getId());
            map.put("studentId", s.getId());
            map.put("name", u != null && u.getFullName() != null ? u.getFullName() : "N/A");
            map.put("major", s.getMajor() != null ? s.getMajor() : "Chưa cập nhật");
            map.put("university", s.getUniversity() != null ? s.getUniversity() : "Chưa cập nhật");
            map.put("avatar", s.getAvatarUrl());
            map.put("position", s.getMajor() != null ? s.getMajor() : "Chưa cập nhật");
            map.put("savedDate", sc.getSavedAt() != null ? sc.getSavedAt().toString() : null);
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách ứng viên đã lưu thành công", result));
    }

    @GetMapping("/{studentId}/detail")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Object>> getCandidateDetail(@PathVariable Integer studentId, Authentication authentication) {
        Company company = getCurrentCompany(authentication);
        if (company == null) return ResponseEntity.status(403).body(ApiResponse.error("Không có quyền doanh nghiệp", "FORBIDDEN"));

        // Kiểm tra xem doanh nghiệp có quyền xem ứng viên này không (đã lưu HOẶC đã nộp đơn)
        boolean isSaved = savedCandidateRepository.findByCompanyIdAndStudentId(company.getId(), studentId).isPresent();
        boolean hasApplied = applicationRepository.existsByJobCompanyIdAndStudentId(company.getId(), studentId);

        if (!isSaved && !hasApplied) {
            return ResponseEntity.status(403).body(ApiResponse.error("Bạn không có quyền thực hiện hành động này", "FORBIDDEN"));
        }

        StudentProfileResponse profile = candidateSearchService.getStudentById(studentId);
        if (profile == null) return ResponseEntity.status(404).body(ApiResponse.error("Không tìm thấy ứng viên", "NOT_FOUND"));

        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết ứng viên thành công", profile));
    }

    @GetMapping("/{studentId}/cv")
    public void downloadCv(@PathVariable Integer studentId, HttpServletResponse response, Authentication authentication) throws IOException {
        Company company = getCurrentCompany(authentication);
        if (company == null) {
            response.sendError(403, "Không có quyền doanh nghiệp");
            return;
        }

        // Kiểm tra xem doanh nghiệp có quyền tải CV ứng viên này không (đã lưu HOẶC đã nộp đơn)
        boolean isSaved = savedCandidateRepository.findByCompanyIdAndStudentId(company.getId(), studentId).isPresent();
        boolean hasApplied = applicationRepository.existsByJobCompanyIdAndStudentId(company.getId(), studentId);

        if (!isSaved && !hasApplied) {
            response.sendError(403, "Bạn không có quyền thực hiện hành động này");
            return;
        }

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=cv_" + studentId + ".pdf");
        pdfExportService.exportProfileToPdf(studentId, response);
    }
}
