package com.Jyotiraditya.FitnessWeb.services;

import com.Jyotiraditya.FitnessWeb.dto.WorkoutPlanDTO;
import com.Jyotiraditya.FitnessWeb.entity.ProfileEntity;
import com.Jyotiraditya.FitnessWeb.entity.WorkoutPlanEntity;
import com.Jyotiraditya.FitnessWeb.repository.WorkoutPlanRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.jdbc.Work;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutPlanService {

    private final WorkoutPlanRepository workoutPlanRepository;
    private final ProfileService profileService;

    public List<WorkoutPlanDTO> getWorkoutInfo() {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        List<WorkoutPlanEntity> plans =
                workoutPlanRepository.findByProfile(currentProfile);

        return plans.stream()
                .map(this::mapToDTO)
                .toList();
    }

    public WorkoutPlanDTO getAccToId(Long id) {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        WorkoutPlanEntity entity = workoutPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));

        // Security check (very important)
        if (!entity.getProfile().getId().equals(currentProfile.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        return mapToDTO(entity);
    }

    public WorkoutPlanDTO addNewWorkoutPlan(WorkoutPlanDTO dto) {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        WorkoutPlanEntity entity = WorkoutPlanEntity.builder()
                .planName(dto.getPlanName())
                .difficulty(dto.getDifficulty())
                .workoutDays(dto.getWorkoutDays())
                .profile(currentProfile)
                .build();

        WorkoutPlanEntity saved = workoutPlanRepository.save(entity);

        return mapToDTO(saved);
    }

    public WorkoutPlanDTO updateWorkoutPlan(Long id, WorkoutPlanDTO dto) {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        WorkoutPlanEntity entity = workoutPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));

        if (!entity.getProfile().getId().equals(currentProfile.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        entity.setPlanName(dto.getPlanName());
        entity.setDifficulty(dto.getDifficulty());
        entity.setWorkoutDays(dto.getWorkoutDays());

        WorkoutPlanEntity updated = workoutPlanRepository.save(entity);

        return mapToDTO(updated);
    }

    public String deleteWorkoutplan(Long id) {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        WorkoutPlanEntity entity = workoutPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));

        if (!entity.getProfile().getId().equals(currentProfile.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        workoutPlanRepository.delete(entity);

        return "Workout plan deleted successfully";
    }

    private WorkoutPlanDTO mapToDTO(WorkoutPlanEntity entity) {

        WorkoutPlanDTO dto = new WorkoutPlanDTO();

        dto.setId(entity.getId());
        dto.setPlanName(entity.getPlanName());
        dto.setDifficulty(entity.getDifficulty());
        dto.setWorkoutDays(entity.getWorkoutDays());

        return dto;
    }
}

