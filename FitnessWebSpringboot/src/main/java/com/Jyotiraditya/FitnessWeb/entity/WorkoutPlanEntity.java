package com.Jyotiraditya.FitnessWeb.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Entity
@Table(name = "tbl_workout_plan")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WorkoutPlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String planName;

    @ElementCollection
    @CollectionTable(
            name = "workout_days",
            joinColumns = @JoinColumn(name = "workout_plan_id")
    )
    @MapKeyColumn(name = "day")
    @Column(name = "exercise")
    private Map<String, String> workoutDays;

    private String difficulty;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private ProfileEntity profile;
}
