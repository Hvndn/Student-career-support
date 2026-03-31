package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.Language;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.LanguageRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import com.fivecore.jobportal.dto.LanguageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LanguageService {

    private final LanguageRepository languageRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public void addLanguage(Integer studentId, Language language) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        language.setStudent(student);
        languageRepository.save(language);
    }

    @Transactional
    public void updateLanguage(Integer id, Integer studentId, LanguageRequest request) {
        Language lang = languageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mục ngoại ngữ"));
        if (!lang.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền sửa mục này");
        }
        lang.setLanguageName(request.getLanguageName());
        lang.setProficiency(request.getProficiency());
        lang.setCertificate(request.getCertificate());
        languageRepository.save(lang);
    }

    @Transactional
    public void deleteLanguage(Integer id, Integer studentId) {
        Language lang = languageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mục ngoại ngữ"));
        if (!lang.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền xóa mục này");
        }
        languageRepository.delete(lang);
    }
}
