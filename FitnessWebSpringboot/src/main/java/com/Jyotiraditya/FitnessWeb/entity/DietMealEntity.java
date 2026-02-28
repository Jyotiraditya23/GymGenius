package com.Jyotiraditya.FitnessWeb.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_diet_meal")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietMealEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mealName;          // Breakfast, Lunch, etc.
    private String mealType;          // VEG/NON-VEG

    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;

    @Column(length = 3000)
    private String recipe;            // AI generated recipe steps

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diet_plan_id")
    private DietPlanEntity dietPlan;
}