package com.Jyotiraditya.FitnessWeb.dto.aiworkoutplan;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AiWorkoutRequestDTO {

    private Integer age;
    private Double height;
    private Double weight;
    private String goal;
    private Integer workoutDaysPerWeek;
    private String difficulty;

    private Map<String, String> preferredMuscleSplit;
}