package com.Jyotiraditya.FitnessWeb.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.scheduling.annotation.Async;

import java.time.LocalDateTime;

@Entity
@Table(name = "diet_plan")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DietPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String planName;
    private Integer totalCalorie;
    private Integer protein;
    private Integer carbs;
    private LocalDateTime createdDateTime;


}
