package com.Jyotiraditya.FitnessWeb.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "tbl_fitness_profile")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FitnessProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer age;
    private Double height;
    private Double weight;
    private String goal;
    private String dietPreference;
    private Integer monthlyBudget;
    private String workoutDays;

    @OneToOne
    @JoinColumn(name = "profile_id", unique = true)
    private ProfileEntity profileEntity;
}





