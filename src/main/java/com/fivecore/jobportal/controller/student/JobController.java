package com.fivecore.jobportal.controller.student;

import com.fivecore.jobportal.dto.JobResponse;
import com.fivecore.jobportal.service.student.JobSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class JobController {

    private final JobSearchService jobSearchService;

    @GetMapping("/jobs")
    public String showJobsPage(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "skill", required = false) String skill,
            @RequestParam(value = "jobType", required = false) String jobType,
            Model model) {
        
        List<JobResponse> jobs = jobSearchService.searchJobs(keyword, location, skill, jobType);
        model.addAttribute("jobs", jobs);
        model.addAttribute("keyword", keyword);
        model.addAttribute("location", location);
        
        return "student/jobs";
    }
}
