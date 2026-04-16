package com.fivecore.jobportal.service.student;

import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.SavedJob;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.SavedJobRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Dịch vụ Quản lý Tin Lưu (US-015).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final JobSearchService jobSearchService;

    @Transactional
    public void saveJob(Integer studentId, Integer jobId) {
        var existing = savedJobRepository.findByStudentIdAndJobId(studentId, jobId);
        
        if (existing.isPresent()) {
            savedJobRepository.delete(existing.get());
            log.info("Sinh vien ID {} da bo luu job ID {}", studentId, jobId);
        } else {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Khong tim thay sinh vien"));
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Khong tim thay tin tuyen dung"));

            SavedJob savedJob = SavedJob.builder()
                    .student(student)
                    .job(job)
                    .build();

            savedJobRepository.save(savedJob);
            log.info("Sinh vien {} da luu job {}", student.getUser().getFullName(), job.getTitle());
        }
    }

    @Transactional(readOnly = true)
    public java.util.List<com.fivecore.jobportal.dto.JobResponse> getSavedJobs(Integer studentId) {
        return savedJobRepository.findByStudentIdOrderBySavedAtDesc(studentId).stream()
                .map(sj -> jobSearchService.mapToResponse(sj.getJob(), true))
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public void unsaveJob(Integer studentId, Integer jobId) {
        savedJobRepository.deleteByStudentIdAndJobId(studentId, jobId);
    }
}
