package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.entity.Education;
import com.fivecore.jobportal.repository.EducationRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Dịch vụ Quản lý Hồ sơ (US-011).
 * Tập trung vào các thông tin học vấn, kinh nghiệm và chứng chỉ.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final StudentRepository studentRepository;
    private final EducationRepository educationRepository;

    /**
     * Lấy danh sách Học vấn của sinh viên.
     */
    public List<Education> getEducations(Integer studentId) {
        return educationRepository.findByStudentIdOrderByStartDateDesc(studentId);
    }

    /**
     * Cập nhật thông tin hồ sơ sinh viên (US-011).
     */
    @Transactional
    public void updateProfile(Integer studentId, com.fivecore.jobportal.dto.StudentProfileRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        // Cập nhật thông tin trong User entity
        com.fivecore.jobportal.entity.User user = student.getUser();
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }

        // Cập nhật thông tin trong Student entity
        if (request.getUniversity() != null) student.setUniversity(request.getUniversity());
        if (request.getMajor() != null) student.setMajor(request.getMajor());
        if (request.getGraduationYear() != null) student.setGraduationYear(request.getGraduationYear());
        if (request.getGpa() != null) student.setGpa(request.getGpa());
        if (request.getTotalCredits() != null) student.setTotalCredits(request.getTotalCredits());
        if (request.getEarnedCredits() != null) student.setEarnedCredits(request.getEarnedCredits());
        if (request.getClassRank() != null) student.setClassRank(request.getClassRank());
        if (request.getAcademicYear() != null) student.setAcademicYear(request.getAcademicYear());
        if (request.getCurrentTerm() != null) student.setCurrentTerm(request.getCurrentTerm());
        if (request.getBio() != null) student.setBio(request.getBio());
        if (request.getPhone() != null) student.setPhone(request.getPhone());
        if (request.getAddress() != null) student.setAddress(request.getAddress());
        if (request.getCoverImageUrl() != null) student.setCoverImageUrl(request.getCoverImageUrl());
        if (request.getVideoUrl() != null) student.setVideoUrl(request.getVideoUrl());
        if (request.getGithubUrl() != null) student.setGithubUrl(request.getGithubUrl());
        if (request.getLinkedinUrl() != null) student.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getCvData() != null) student.setCvData(request.getCvData());

        studentRepository.save(student);
        log.info("Đã cập nhật thông tin hồ sơ cho sinh viên ID: {}", studentId);
    }

    /** Cập nhật riêng ảnh đại diện. */
    @Transactional
    public void updateAvatar(Integer studentId, String avatarUrl) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        student.setAvatarUrl(avatarUrl);
        studentRepository.save(student);
    }

    /** Thêm Học vấn mới. */
    @Transactional
    public Education addEducation(Integer studentId, Education education) {
        if (education.getEndDate() != null && education.getEndDate().isBefore(education.getStartDate())) {
            throw new IllegalArgumentException("Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu");
        }
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        education.setStudent(student);
        return educationRepository.save(education);
    }

    /** Cập nhật Học vấn cụ thể. */
    @Transactional
    public void updateEducation(Integer id, Integer studentId, com.fivecore.jobportal.dto.EducationRequest request) {
        Education edu = educationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học vấn"));
        if (!edu.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền sửa mục này");
        }
        edu.setSchoolName(request.getSchoolName());
        edu.setMajor(request.getMajor());
        edu.setStartDate(request.getStartDate());
        edu.setEndDate(request.getEndDate());
        edu.setDescription(request.getDescription());
        educationRepository.save(edu);
    }

    /** Xóa Học vấn. */
    @Transactional
    public void deleteEducation(Integer id, Integer studentId) {
        Education edu = educationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin học vấn"));
        if (!edu.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền xóa mục này");
        }
        educationRepository.delete(edu);
    }
}
