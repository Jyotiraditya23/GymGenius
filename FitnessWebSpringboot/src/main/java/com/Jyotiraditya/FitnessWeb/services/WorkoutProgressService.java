package com.Jyotiraditya.FitnessWeb.services;

import com.Jyotiraditya.FitnessWeb.dto.VolumeProgressDTO;
import com.Jyotiraditya.FitnessWeb.dto.WorkoutProgressDTO;
import com.Jyotiraditya.FitnessWeb.entity.ProfileEntity;
import com.Jyotiraditya.FitnessWeb.entity.WorkoutProgress;
import com.Jyotiraditya.FitnessWeb.repository.WorkoutProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutProgressService{

    private final WorkoutProgressRepository repository;
    private final ProfileService profileService;

    public List<WorkoutProgress> getAllProgress() {
        return repository.findAll();
    }

    public WorkoutProgress saveProgress(WorkoutProgressDTO dto) {

        ProfileEntity profile = profileService.getCurrentProfile();

        WorkoutProgress progress = new WorkoutProgress();
        progress.setUserId(profile.getId());
        progress.setExerciseName(dto.getExerciseName());
        progress.setMuscleGroup(dto.getMuscleGroup());
        progress.setWeight(dto.getWeight());
        progress.setReps(dto.getReps());
        progress.setSets(dto.getSets());
        progress.setDate(dto.getDate());

        return repository.save(progress);
    }

    public WorkoutProgress updateProgress(
            Long progressId,
            WorkoutProgressDTO dto) {

        ProfileEntity profile = profileService.getCurrentProfile();

        WorkoutProgress existing = repository.findById(progressId)
                .orElseThrow(() -> new RuntimeException("Workout progress not found"));

        if (!existing.getUserId().equals(profile.getId())) {
            throw new RuntimeException("You are not allowed to update this record");
        }

        existing.setExerciseName(dto.getExerciseName());
        existing.setMuscleGroup(dto.getMuscleGroup());
        existing.setWeight(dto.getWeight());
        existing.setReps(dto.getReps());
        existing.setSets(dto.getSets());
        existing.setDate(dto.getDate());

        return repository.save(existing);
    }


    public void deleteProgress(Long progressId) {

        ProfileEntity profile = profileService.getCurrentProfile();

        WorkoutProgress existing = repository.findById(progressId)
                .orElseThrow(() -> new RuntimeException("Workout progress not found"));

        if (!existing.getUserId().equals(profile.getId())) {
            throw new RuntimeException("You are not allowed to delete this record");
        }

        repository.delete(existing);
    }
    public List<WorkoutProgress>
    getMyWorkoutByMuscleGroup(String muscleGroup) {

        ProfileEntity profile = profileService.getCurrentProfile();

        return repository
                .findByUserIdAndMuscleGroupOrderByDateAsc(
                        profile.getId(),
                        muscleGroup
                );
    }

    public List<VolumeProgressDTO> getVolumeProgressByMuscle(
            String muscleGroup) {

        ProfileEntity profile = profileService.getCurrentProfile();

        List<Object[]> results =
                repository.getDailyVolumeByMuscle(
                        profile.getId(),
                        muscleGroup
                );

        return results.stream()
                .map(obj -> new VolumeProgressDTO(
                        (LocalDate) obj[0],
                        ((Number) obj[1]).intValue()
                ))
                .toList();
    }




}