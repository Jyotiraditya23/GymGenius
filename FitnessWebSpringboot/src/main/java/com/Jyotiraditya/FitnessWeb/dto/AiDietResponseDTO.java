package com.Jyotiraditya.FitnessWeb.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiDietResponseDTO {

    private String planName;

    private Integer totalCalories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;

    private List<Meal> meals;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Meal {

        private String mealName;
        private String mealType;

        private Integer calories;
        private Integer protein;
        private Integer carbs;
        private Integer fats;

        private String recipe;
    }
}