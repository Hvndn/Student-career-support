package com.fivecore.jobportal.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "daily_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyStat {
    @Id
    private LocalDate date;
    
    @Builder.Default
    private int loginCount = 0;
}
