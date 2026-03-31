package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.Certification;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.CertificationRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CertificationService {
    private final CertificationRepository certificationRepository;
    private final StudentRepository studentRepository;

    public List<Certification> getCertificationsByStudent(Integer studentId) {
        return certificationRepository.findByStudentId(studentId);
    }

    @Transactional
    public Certification addCertification(Integer studentId, Certification certification) {
        java.util.Objects.requireNonNull(studentId, "Student ID cannot be null");
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        certification.setStudent(student);
        log.info("Thêm chứng chỉ mới cho sinh viên ID: {}", studentId);
        return certificationRepository.save(certification);
    }

    @Transactional
    public Certification updateCertification(Integer id, Integer studentId, Certification certData) {
        java.util.Objects.requireNonNull(id, "ID cannot be null");
        Certification existing = certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chứng chỉ"));
        
        if (!existing.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền sửa chứng chỉ này");
        }

        existing.setName(certData.getName());
        existing.setIssuer(certData.getIssuer());
        existing.setIssueDate(certData.getIssueDate());
        existing.setExpirationDate(certData.getExpirationDate());
        existing.setCertificateUrl(certData.getCertificateUrl());

        log.info("Cập nhật chứng chỉ ID: {}", id);
        return certificationRepository.save(existing);
    }

    @Transactional
    public void deleteCertification(Integer id, Integer studentId) {
        java.util.Objects.requireNonNull(id, "ID cannot be null");
        Certification existing = certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chứng chỉ"));
        
        if (!existing.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền xóa chứng chỉ này");
        }

        certificationRepository.delete(existing);
        log.info("Đã xóa chứng chỉ ID: {}", id);
    }
}
