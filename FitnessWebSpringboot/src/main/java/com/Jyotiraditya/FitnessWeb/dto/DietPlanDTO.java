package com.Jyotiraditya.FitnessWeb.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class DietPlanDTO {
    private Long id;
    private String planName;
    private Integer totalCalorie;
    private Integer protein;
    private Integer carbs;
    private LocalDateTime createdDateTime;
}
