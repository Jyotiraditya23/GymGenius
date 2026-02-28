package com.Jyotiraditya.FitnessWeb.dto;

import lombok.Data;

@Data
public class DietMealDTO {

    private Long id;
    private String mealName;
    private String mealType;
    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;
    private String recipe;
}