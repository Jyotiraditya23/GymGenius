package com.Jyotiraditya.FitnessWeb.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class WorkoutPlanDTO {
    private Long id;
    private String planName;
    private Map<String, String> workoutDays;
    private String difficulty;
}
