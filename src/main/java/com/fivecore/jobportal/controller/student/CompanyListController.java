package com.fivecore.jobportal.controller.student;

import com.fivecore.jobportal.entity.Company;
import com.fivecore.jobportal.service.company.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class CompanyListController {

    private final CompanyService companyService;

    @GetMapping("/companies")
    public String showCompaniesPage(Model model) {
        List<Company> companies = companyService.getAllCompanies();
        model.addAttribute("companies", companies);
        return "student/companies";
    }

    @GetMapping("/companies/{id}")
    public String showCompanyDetailPage(@PathVariable Integer id, Model model) {
        Company company = companyService.getCompanyById(id);
        model.addAttribute("company", company);
        model.addAttribute("jobs", companyService.getJobsByCompany(id));
        return "student/company_detail";
    }
}
