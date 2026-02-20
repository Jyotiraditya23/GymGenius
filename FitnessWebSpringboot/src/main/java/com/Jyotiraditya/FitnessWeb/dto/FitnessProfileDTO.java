package com.Jyotiraditya.FitnessWeb.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FitnessProfileDTO {
    private Long id;
    private Integer age;
    private Double height;
    private Double weight;
    private String goal;
    private String dietPreference;
    private Integer monthlyBudget;
    private String workoutDays;
}
