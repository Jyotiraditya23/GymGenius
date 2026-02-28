package com.Jyotiraditya.FitnessWeb.dto;

import lombok.Data;

import java.util.List;

@Data
public class DietPlanDTO {

    private Long id;
    private String planName;

    private Integer totalCalories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;

    private List<DietMealDTO> meals;
}