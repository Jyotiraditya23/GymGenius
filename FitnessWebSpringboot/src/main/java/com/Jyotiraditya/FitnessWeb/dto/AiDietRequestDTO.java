package com.Jyotiraditya.FitnessWeb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiDietRequestDTO {

    private String planName;
    // User Profile Data
    private Integer age;
    private Double height;
    private Double weight;
    private String goal;

    // 🔥 Custom Macro Input (User Specific)
    private Integer targetCalories;
    private Integer targetProtein;
    private Integer targetCarbs;
    private Integer targetFats;

    // 🔥 Custom Notes (Allergies / Instructions)
    private String note;
}