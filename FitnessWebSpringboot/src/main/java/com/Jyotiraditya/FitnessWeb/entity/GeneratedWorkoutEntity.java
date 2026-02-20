package com.Jyotiraditya.FitnessWeb.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneratedWorkoutEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String planName;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String workoutJson;  // 🔥 Store complete structured workout

    private LocalDateTime generatedAt;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private ProfileEntity profile;
}