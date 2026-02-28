package com.Jyotiraditya.FitnessWeb.services;

import com.Jyotiraditya.FitnessWeb.dto.FitnessProfileDTO;
import com.Jyotiraditya.FitnessWeb.entity.FitnessProfileEntity;
import com.Jyotiraditya.FitnessWeb.entity.ProfileEntity;
import com.Jyotiraditya.FitnessWeb.repository.FitnessProfileRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor

public class FitnessProfileService {

    private final FitnessProfileRepository fitnessProfileRepository;
    private final ProfileService profileService;

    public FitnessProfileDTO getCompleteInformation() {

        ProfileEntity profile = profileService.getCurrentProfile();

        Optional<FitnessProfileEntity> entity =
                fitnessProfileRepository.findByProfileEntity(profile);

        if (entity.isEmpty()) {
            return null;   // <-- IMPORTANT FIX
        }

        return toDTO(entity.get());
    }

    public FitnessProfileDTO addFitnessInformation(FitnessProfileDTO dto) {

        ProfileEntity profile = profileService.getCurrentProfile();

        // Prevent duplicate fitness profile
        if (fitnessProfileRepository.findByProfileEntity(profile).isPresent()) {
            throw new RuntimeException("Fitness profile already exists");
        }

        FitnessProfileEntity entity = toEntity(dto);
        entity.setProfileEntity(profile);

        FitnessProfileEntity saved = fitnessProfileRepository.save(entity);

        return toDTO(saved);
    }

    public FitnessProfileDTO updateInformation(FitnessProfileDTO dto) {

        ProfileEntity profile = profileService.getCurrentProfile();

        FitnessProfileEntity existing = fitnessProfileRepository
                .findByProfileEntity(profile)
                .orElseThrow(() -> new RuntimeException("Fitness profile not found"));

        existing.setAge(dto.getAge());
        existing.setHeight(dto.getHeight());
        existing.setWeight(dto.getWeight());
        existing.setGoal(dto.getGoal());
        existing.setDietPreference(dto.getDietPreference());
        existing.setMonthlyBudget(dto.getMonthlyBudget());
        existing.setWorkoutDays(dto.getWorkoutDays());

        FitnessProfileEntity updated = fitnessProfileRepository.save(existing);

        return toDTO(updated);
    }

    @Transactional
    public void deleteInformation() {

        ProfileEntity profile = profileService.getCurrentProfile();

        FitnessProfileEntity entity = fitnessProfileRepository
                .findByProfileEntity(profile)
                .orElseThrow(() -> new RuntimeException("Fitness profile not found"));

        profile.setFitnessProfile(null);

        fitnessProfileRepository.delete(entity);
    }

    private FitnessProfileDTO toDTO(FitnessProfileEntity entity) {

        FitnessProfileDTO dto = new FitnessProfileDTO();

        dto.setId(entity.getId());
        dto.setAge(entity.getAge());
        dto.setHeight(entity.getHeight());
        dto.setWeight(entity.getWeight());
        dto.setGoal(entity.getGoal());
        dto.setDietPreference(entity.getDietPreference());
        dto.setMonthlyBudget(entity.getMonthlyBudget());
        dto.setWorkoutDays(entity.getWorkoutDays());

        return dto;
    }

    private FitnessProfileEntity toEntity(FitnessProfileDTO dto) {

        return FitnessProfileEntity.builder()
                .age(dto.getAge())
                .height(dto.getHeight())
                .weight(dto.getWeight())
                .goal(dto.getGoal())
                .dietPreference(dto.getDietPreference())
                .monthlyBudget(dto.getMonthlyBudget())
                .workoutDays(dto.getWorkoutDays())
                .build();
    }
}

