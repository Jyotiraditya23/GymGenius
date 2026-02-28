package com.Jyotiraditya.FitnessWeb.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "workout_progress")
@Data
public class WorkoutProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String exerciseName;

    @Column(nullable = false)
    private String muscleGroup;

    private int weight;
    private int reps;
    private int sets;

    private int volume;

    private LocalDate date;

    @PrePersist
    @PreUpdate
    public void calculateVolume() {
        this.volume = weight * reps * sets;
    }
}