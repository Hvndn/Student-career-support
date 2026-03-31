package com.fivecore.jobportal.service.student;

import com.fivecore.jobportal.entity.*;
import com.fivecore.jobportal.repository.JobRepository;
import com.fivecore.jobportal.repository.SavedJobRepository;
import com.fivecore.jobportal.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SavedJobServiceTest {

    @Mock
    private SavedJobRepository savedJobRepository;
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private SavedJobService savedJobService;

    private Student mockStudent;
    private Job mockJob;
    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setFullName("Nguyen Van A");

        mockStudent = new Student();
        mockStudent.setId(1);
        mockStudent.setUser(mockUser);

        mockJob = new Job();
        mockJob.setId(10);
        mockJob.setTitle("Java Developer");
    }

    @Test
    void testSaveJob_Success() {
        when(savedJobRepository.findByStudentIdAndJobId(1, 10)).thenReturn(Optional.empty());
        when(studentRepository.findById(1)).thenReturn(Optional.of(mockStudent));
        when(jobRepository.findById(10)).thenReturn(Optional.of(mockJob));

        savedJobService.saveJob(1, 10);

        verify(savedJobRepository).save(any(SavedJob.class));
    }

    @Test
    void testSaveJob_AlreadySaved_ThrowsException() {
        SavedJob existing = new SavedJob();
        when(savedJobRepository.findByStudentIdAndJobId(1, 10)).thenReturn(Optional.of(existing));

        assertThrows(IllegalArgumentException.class, () -> savedJobService.saveJob(1, 10));
        verify(savedJobRepository, never()).save(any());
    }

    @Test
    void testSaveJob_StudentNotFound_ThrowsException() {
        when(savedJobRepository.findByStudentIdAndJobId(1, 10)).thenReturn(Optional.empty());
        when(studentRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> savedJobService.saveJob(1, 10));
    }

    @Test
    void testSaveJob_JobNotFound_ThrowsException() {
        when(savedJobRepository.findByStudentIdAndJobId(1, 10)).thenReturn(Optional.empty());
        when(studentRepository.findById(1)).thenReturn(Optional.of(mockStudent));
        when(jobRepository.findById(10)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> savedJobService.saveJob(1, 10));
    }

    @Test
    void testGetSavedJobs_ReturnsList() {
        SavedJob s1 = new SavedJob();
        when(savedJobRepository.findByStudentIdOrderBySavedAtDesc(1)).thenReturn(List.of(s1));

        List<SavedJob> result = savedJobService.getSavedJobs(1);

        assertEquals(1, result.size());
    }

    @Test
    void testUnsaveJob_CallsDelete() {
        savedJobService.unsaveJob(1, 10);

        verify(savedJobRepository).deleteByStudentIdAndJobId(1, 10);
    }
}
