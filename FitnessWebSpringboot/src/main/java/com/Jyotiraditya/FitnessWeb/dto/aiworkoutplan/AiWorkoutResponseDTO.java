package com.Jyotiraditya.FitnessWeb.dto.aiworkoutplan;

import lombok.Data;

import java.util.List;

@Data
public class AiWorkoutResponseDTO {

    private String planName;
    private List<WorkoutDay> days;

    @Data
    public static class WorkoutDay {
        private String day;
        private String muscleGroup;
        private List<Exercise> exercises;
    }

    @Data
    public static class Exercise {
        private String name;
        private Integer sets;
        private Integer reps;
        private String notes;
    }
}