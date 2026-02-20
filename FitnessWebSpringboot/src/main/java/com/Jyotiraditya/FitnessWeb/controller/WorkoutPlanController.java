package com.Jyotiraditya.FitnessWeb.controller;

import com.Jyotiraditya.FitnessWeb.dto.WorkoutPlanDTO;
import com.Jyotiraditya.FitnessWeb.dto.aiworkoutplan.AiWorkoutResponseDTO;
import com.Jyotiraditya.FitnessWeb.entity.WorkoutPlanEntity;
import com.Jyotiraditya.FitnessWeb.services.WorkoutGenerationService;
import com.Jyotiraditya.FitnessWeb.services.WorkoutPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workoutPlan")
public class WorkoutPlanController {

    private final WorkoutPlanService workoutPlanService;
    private final WorkoutGenerationService generationService;

    @GetMapping
    public ResponseEntity<List<WorkoutPlanDTO>> getAllWorkoutInfo(){
        return ResponseEntity.ok(workoutPlanService.getWorkoutInfo());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutPlanDTO> getWorkout(@PathVariable Long id){
        return ResponseEntity.ok(workoutPlanService.getAccToId(id));
    }

    @PostMapping
    public ResponseEntity<WorkoutPlanDTO> postWorkoutInfo(
            @RequestBody WorkoutPlanDTO workoutPlanDTO){
        return ResponseEntity.ok(
                workoutPlanService.addNewWorkoutPlan(workoutPlanDTO)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutPlanDTO> updateWorkoutInfo(
            @PathVariable Long id,
            @RequestBody WorkoutPlanDTO workoutPlanDTO){
        return ResponseEntity.ok(
                workoutPlanService.updateWorkoutPlan(id, workoutPlanDTO)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorkoutPlan(@PathVariable Long id){
        return ResponseEntity.ok(
                workoutPlanService.deleteWorkoutplan(id)
        );
    }

    @PostMapping("/generate/{workoutId}")
    public ResponseEntity<AiWorkoutResponseDTO> generateWorkout(
            @PathVariable Long workoutId) {
        return ResponseEntity.ok(
                generationService.generateWorkout(workoutId)
        );
    }

    @GetMapping("/generated/{id}")
    public ResponseEntity<AiWorkoutResponseDTO> getGeneratedWorkout(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                generationService.getGeneratedWorkout(id)
        );
    }
}
