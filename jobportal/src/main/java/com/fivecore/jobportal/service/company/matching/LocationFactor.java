package com.fivecore.jobportal.service.company.matching;

import com.fivecore.jobportal.entity.Job;
import com.fivecore.jobportal.entity.Student;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class LocationFactor implements ScoringFactor {

    @Override
    public String getName() {
        return "location";
    }

    @Override
    public double calculate(Student student, Job job, Map<String, Object> details) {
        if (job.getJobType() == Job.JobType.remote) {
            details.put("location_reason", "Công việc từ xa (Remote) - Phù hợp 100%");
            return 1.0;
        }

        if (student.getAddress() == null || student.getAddress().isBlank()) {
            details.put("is_missing_data", true);
            details.put("location_reason", "Ứng viên chưa cập nhật địa chỉ");
            return 0.0;
        }

        if (student.getAddress() != null && job.getLocation() != null) {
            String sAddr = student.getAddress().toLowerCase();
            String jLoc = job.getLocation().toLowerCase();
            if (sAddr.contains(jLoc) || jLoc.contains(sAddr)) {
                details.put("location_reason", "Cùng địa điểm làm việc");
                return 1.0;
            }
        }

        details.put("location_reason", "Khác địa điểm làm việc");
        return 0.2; // Vẫn cho một ít điểm vì có thể ứng viên sẵn sàng di chuyển
    }
}
