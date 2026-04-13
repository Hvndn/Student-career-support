package com.fivecore.jobportal.repository;

import com.fivecore.jobportal.entity.DailyStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface DailyStatRepository extends JpaRepository<DailyStat, LocalDate> {
}
