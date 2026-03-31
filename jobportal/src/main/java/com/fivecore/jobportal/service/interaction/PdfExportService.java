package com.fivecore.jobportal.service.interaction;

import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.service.auth.ProfileService;
import com.fivecore.jobportal.service.auth.ProjectService;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Dịch vụ Xuất PDF (US-012).
 * Tạo file PDF chưa hồ sơ năng lực của Sinh viên.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PdfExportService {

    private final StudentRepository studentRepository;
    private final ProfileService profileService;
    private final ProjectService projectService;

    public void exportProfileToPdf(Integer studentId, HttpServletResponse response) throws IOException {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        // Nếu sinh viên chưa có thông tin cơ bản
        if (student.getUser() == null || student.getSkills() == null) {
            throw new IllegalArgumentException("Hồ sơ cần cập nhật thêm thông tin trước khi xuất PDF.");
        }

        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        // Nạp font hỗ trợ tiếng Việt (Sử dụng Arial từ hệ thống Windows)
        String fontPath = "C:\\Windows\\Fonts\\arial.ttf";
        BaseFont bf;
        try {
            bf = BaseFont.createFont(fontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        } catch (Exception e) {
            log.warn("Không tìm thấy font Arial, sử dụng font mặc định (có thể lỗi tiếng Việt): {}", e.getMessage());
            bf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
        }

        Font fontTitle = new Font(bf, 22, Font.BOLD);
        Font fontSubtitle = new Font(bf, 16, Font.BOLD);
        Font fontBody = new Font(bf, 12, Font.NORMAL);

        // Header Title
        Paragraph title = new Paragraph("HỒ SƠ NĂNG LỰC - " + student.getUser().getFullName().toUpperCase(), fontTitle);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph("\n"));

        // Personal Info
        document.add(new Paragraph("THÔNG TIN CÁ NHÂN", fontSubtitle));
        document.add(new Paragraph("Email: " + student.getUser().getEmail(), fontBody));
        document.add(new Paragraph("Trường: " + (student.getUniversity() != null ? student.getUniversity() : "N/A"),
                fontBody));
        document.add(new Paragraph("Ngành: " + (student.getMajor() != null ? student.getMajor() : "N/A"), fontBody));
        document.add(new Paragraph("Giới thiệu: " + (student.getBio() != null ? student.getBio() : ""), fontBody));
        document.add(new Paragraph("\n"));

        // Skills
        document.add(new Paragraph("KỸ NĂNG CHUYÊN MÔN", fontSubtitle));
        if (student.getSkills() == null || student.getSkills().isEmpty()) {
            document.add(new Paragraph("- (Chưa có thông tin)", fontBody));
        } else {
            student.getSkills().forEach(ss -> {
                try {
                    document.add(new Paragraph("- " + ss.getSkill().getName() + " (" + ss.getLevel() + ")", fontBody));
                } catch (Exception e) {
                }
            });
        }
        document.add(new Paragraph("\n"));

        // Educations
        document.add(new Paragraph("HỌC VẤN", fontSubtitle));
        var educations = profileService.getEducations(studentId);
        if (educations.isEmpty()) {
            document.add(new Paragraph("- (Chưa có thông tin)", fontBody));
        } else {
            educations.forEach(edu -> {
                try {
                    String eduInfo = "- " + edu.getSchoolName() + " | "
                            + (edu.getDegree() != null ? edu.getDegree() + " - " : "") + edu.getMajor();
                    document.add(new Paragraph(eduInfo + " (" + edu.getStartDate() + " to "
                            + (edu.getEndDate() != null ? edu.getEndDate() : "Nay") + ")", fontBody));
                } catch (Exception e) {
                }
            });
        }
        document.add(new Paragraph("\n"));

        // Experiences
        document.add(new Paragraph("KINH NGHIỆM LÀM VIỆC", fontSubtitle));
        var experiences = profileService.getExperiences(studentId);
        if (experiences.isEmpty()) {
            document.add(new Paragraph("- (Chua co thong tin)", fontBody));
        } else {
            experiences.forEach(exp -> {
                try {
                    document.add(
                            new Paragraph(
                                    "- " + exp.getCompanyName() + " | " + exp.getJobTitle() + " (" + exp.getStartDate()
                                            + " to " + (exp.getEndDate() != null ? exp.getEndDate() : "Nay") + ")",
                                    fontBody));
                } catch (Exception e) {
                }
            });
        }
        document.add(new Paragraph("\n"));

        // Projects
        document.add(new Paragraph("DỰ ÁN THỰC TẾ", fontSubtitle));
        var projects = projectService.getProjectsByStudent(studentId);
        if (projects.isEmpty()) {
            document.add(new Paragraph("- (Chưa có thông tin)", fontBody));
        } else {
            projects.forEach(proj -> {
                try {
                    document.add(new Paragraph("- " + proj.getName(), fontBody));
                    document.add(new Paragraph(
                            "  Mô tả: " + (proj.getDescription() != null ? proj.getDescription() : ""), fontBody));
                    document.add(new Paragraph(
                            "  Github: " + (proj.getRepositoryUrl() != null ? proj.getRepositoryUrl() : ""), fontBody));
                } catch (Exception e) {
                }
            });
        }

        document.close();
    }
}
