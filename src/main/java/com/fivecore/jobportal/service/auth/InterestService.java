package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.Interest;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.InterestRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterestService {

    private final InterestRepository interestRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public void addInterest(Integer studentId, Interest interest) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        interest.setStudent(student);
        interestRepository.save(interest);
    }

    @Transactional
    public void deleteInterest(Integer id, Integer studentId) {
        Interest interest = interestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mục sở thích"));
        if (!interest.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền xóa mục này");
        }
        interestRepository.delete(interest);
    }
}
