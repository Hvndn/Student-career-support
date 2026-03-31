package com.fivecore.jobportal.controller.api.student;

import com.fivecore.jobportal.dto.StudentProfileResponse;
import com.fivecore.jobportal.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class StudentProfileMapperTest {

    private StudentProfileMapper mapper;
    private User user;
    private Student student;
    private Project project;

    @BeforeEach
    void setUp() {
        mapper = new StudentProfileMapper();

        user = new User();
        user.setFullName("Nguyen Van A");
        user.setEmail("test@gmail.com");

        student = new Student();
        student.setId(1);
        student.setStudentIdStr("SV001");
        student.setUniversity("HUST");
        student.setMajor("IT");
        
        // Mock sub-lists
        Skill skill = new Skill();
        skill.setId(1);
        skill.setName("Java");
        
        StudentSkill ss = new StudentSkill();
        ss.setSkill(skill);
        ss.setLevel(StudentSkill.SkillLevel.advanced);
        student.setSkills(List.of(ss));

        Education edu = new Education();
        edu.setId(1);
        edu.setSchoolName("HUST");
        student.setEducations(List.of(edu));

        Experience exp = new Experience();
        exp.setId(1);
        exp.setCompanyName("FPT");
        student.setExperiences(List.of(exp));

        Language lang = new Language();
        lang.setId(1);
        lang.setLanguageName("English");
        student.setLanguages(List.of(lang));

        Interest interest = new Interest();
        interest.setId(1);
        interest.setName("Reading");
        student.setInterests(List.of(interest));

        Activity activity = new Activity();
        activity.setId(1);
        activity.setName("Volunteer");
        student.setActivities(List.of(activity));

        Certification cert = new Certification();
        cert.setId(1);
        cert.setName("AWS");
        student.setCertifications(List.of(cert));

        project = new Project();
        project.setId(1);
        project.setName("Job Portal");
    }

    @Test
    void testToResponse_MapsAllFields() {
        StudentProfileResponse response = mapper.toResponse(user, student, List.of(project));

        assertEquals(student.getId(), response.getId());
        assertEquals(user.getFullName(), response.getFullName());
        assertEquals(student.getStudentIdStr(), response.getStudentIdStr());
        assertEquals(1, response.getSkills().size());
        assertEquals("Java", response.getSkills().get(0).getName());
        assertEquals("advanced", response.getSkills().get(0).getLevel());
        assertEquals(1, response.getEducations().size());
        assertEquals(1, response.getExperiences().size());
        assertEquals(1, response.getProjects().size());
        assertEquals(1, response.getLanguages().size());
        assertEquals(1, response.getInterests().size());
        assertEquals(1, response.getActivities().size());
        assertEquals(1, response.getCertifications().size());
    }

    @Test
    void testToResponse_WithNullLists_ReturnsEmptyLists() {
        student.setSkills(null);
        student.setEducations(null);
        student.setExperiences(null);
        student.setLanguages(null);
        student.setInterests(null);
        student.setActivities(null);
        student.setCertifications(null);

        StudentProfileResponse response = mapper.toResponse(user, student, null);

        assertNotNull(response.getSkills());
        assertTrue(response.getSkills().isEmpty());
        assertNotNull(response.getProjects());
        assertTrue(response.getProjects().isEmpty());
    }
}
