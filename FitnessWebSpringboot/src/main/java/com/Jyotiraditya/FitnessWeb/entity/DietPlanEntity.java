package com.Jyotiraditya.FitnessWeb.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tbl_diet_plan")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietPlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String planName;

    private Integer totalCalories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private ProfileEntity profile;

    @OneToMany(
            mappedBy = "dietPlan",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<DietMealEntity> meals;
}