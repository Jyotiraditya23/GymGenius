package com.Jyotiraditya.FitnessWeb.controller;

import com.Jyotiraditya.FitnessWeb.dto.VolumeProgressDTO;
import com.Jyotiraditya.FitnessWeb.dto.WorkoutProgressDTO;
import com.Jyotiraditya.FitnessWeb.entity.WorkoutProgress;
import com.Jyotiraditya.FitnessWeb.services.WorkoutProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workout-progress")
@RequiredArgsConstructor
public class WorkoutProgressController {

    private final WorkoutProgressService service;

    @GetMapping
    public ResponseEntity<List<WorkoutProgress>> getAllProgress() {
        return ResponseEntity.ok(service.getAllProgress());
    }

    @PostMapping
    public ResponseEntity<WorkoutProgress> addProgress(
            @RequestBody WorkoutProgressDTO dto) {
        return ResponseEntity.ok(service.saveProgress(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutProgress> updateProgress(
            @PathVariable Long id,
            @RequestBody WorkoutProgressDTO dto) {
        return ResponseEntity.ok(service.updateProgress(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable Long id) {
        service.deleteProgress(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/muscle/{muscleGroup}")
    public ResponseEntity<List<WorkoutProgress>>
    getWorkoutByMuscleGroup(
            @PathVariable String muscleGroup) {

        return ResponseEntity.ok(
                service.getMyWorkoutByMuscleGroup(muscleGroup)
        );
    }

    @GetMapping("/progress-chart/muscle/{muscleGroup}")
    public ResponseEntity<List<VolumeProgressDTO>>
    getMuscleProgressChart(
            @PathVariable String muscleGroup) {

        return ResponseEntity.ok(
                service.getVolumeProgressByMuscle(muscleGroup)
        );
    }

}
