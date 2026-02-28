package com.Jyotiraditya.FitnessWeb.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WorkoutProgressDTO {

    private Long userId;
    private String exerciseName;
    private String muscleGroup;
    private int weight;
    private int reps;
    private int sets;
    private LocalDate date;
}