package com.fivecore.jobportal.service.auth;

import com.fivecore.jobportal.entity.Activity;
import com.fivecore.jobportal.entity.Student;
import com.fivecore.jobportal.repository.ActivityRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final StudentRepository studentRepository;

    public List<Activity> getActivitiesByStudent(Integer studentId) {
        return activityRepository.findByStudentId(studentId);
    }

    @Transactional
    public Activity addActivity(Integer studentId, Activity activity) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        activity.setStudent(student);
        log.info("Thêm hoạt động mới cho sinh viên ID: {}", studentId);
        return activityRepository.save(activity);
    }

    @Transactional
    public Activity updateActivity(Integer id, Integer studentId, Activity activityData) {
        Activity existing = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hoạt động"));
        
        if (!existing.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền sửa hoạt động này");
        }

        existing.setName(activityData.getName());
        existing.setOrganization(activityData.getOrganization());
        existing.setRole(activityData.getRole());
        existing.setStartDate(activityData.getStartDate());
        existing.setEndDate(activityData.getEndDate());
        existing.setDescription(activityData.getDescription());

        log.info("Cập nhật hoạt động ID: {}", id);
        return activityRepository.save(existing);
    }

    @Transactional
    public void deleteActivity(Integer id, Integer studentId) {
        Activity existing = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hoạt động"));
        
        if (!existing.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Bạn không có quyền xóa hoạt động này");
        }

        activityRepository.delete(existing);
        log.info("Đã xóa hoạt động ID: {}", id);
    }
}
