package com.Jyotiraditya.FitnessWeb.services;

import com.Jyotiraditya.FitnessWeb.dto.FitnessProfileDTO;
import com.Jyotiraditya.FitnessWeb.dto.WorkoutPlanDTO;
import com.Jyotiraditya.FitnessWeb.dto.aiworkoutplan.AiWorkoutRequestDTO;
import com.Jyotiraditya.FitnessWeb.dto.aiworkoutplan.AiWorkoutResponseDTO;
import com.Jyotiraditya.FitnessWeb.entity.GeneratedWorkoutEntity;
import com.Jyotiraditya.FitnessWeb.entity.ProfileEntity;
import com.Jyotiraditya.FitnessWeb.repository.GeneratedWorkoutRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WorkoutGenerationService {

    private final FitnessProfileService fitnessService;
    private final WorkoutPlanService workoutPlanService;
    private final AIService aiService;
    private final ObjectMapper objectMapper;
    private final GeneratedWorkoutRepository generatedWorkoutRepository;
    private final ProfileService profileService;

    public AiWorkoutResponseDTO generateWorkout(Long workoutId) {
        // 1️⃣ Get current logged-in profile
        ProfileEntity currentProfile = profileService.getCurrentProfile();

        // 2️⃣ Fetch user fitness + workout template
        FitnessProfileDTO fitness = fitnessService.getCompleteInformation();
        WorkoutPlanDTO workout = workoutPlanService.getAccToId(workoutId);

        // 3️⃣ Build AI request
        AiWorkoutRequestDTO request =
                AiWorkoutRequestDTO.builder()
                        .age(fitness.getAge())
                        .height(fitness.getHeight())
                        .weight(fitness.getWeight())
                        .goal(fitness.getGoal())
                        .workoutDaysPerWeek(
                                extractWorkoutDays(fitness.getWorkoutDays())
                        )
                        .difficulty(workout.getDifficulty())
                        .preferredMuscleSplit(workout.getWorkoutDays())
                        .build();

        // 4️⃣ Call AI Microservice
        AiWorkoutResponseDTO response =
                aiService.generateWorkout(request);

        // 5️⃣ Save AI result
        saveGeneratedWorkout(currentProfile, response);

        return response;
    }
    private void saveGeneratedWorkout(ProfileEntity profile,
                                      AiWorkoutResponseDTO response) {
        try {
            String json = objectMapper.writeValueAsString(response);

            GeneratedWorkoutEntity entity =
                    GeneratedWorkoutEntity.builder()
                            .planName(response.getPlanName())
                            .workoutJson(json)
                            .generatedAt(LocalDateTime.now())
                            .profile(profile)
                            .build();

            generatedWorkoutRepository.save(entity);

        } catch (Exception e) {
            throw new RuntimeException("Failed to save generated workout");
        }
    }
    public AiWorkoutResponseDTO getGeneratedWorkout(Long id) {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        GeneratedWorkoutEntity entity =
                generatedWorkoutRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (!entity.getProfile().getId().equals(currentProfile.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        try {
            return objectMapper.readValue(
                    entity.getWorkoutJson(),
                    AiWorkoutResponseDTO.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse workout JSON");
        }
    }

    //helper for entering eact values
    private Integer extractWorkoutDays(String workoutDays) {

        if (workoutDays == null || workoutDays.isEmpty()) {
            return 3; // default value
        }

        try {
            // extract first number (ex: "5-6 days/week" -> 5)
            String number = workoutDays.replaceAll("[^0-9]", " ").trim().split(" ")[0];
            return Integer.parseInt(number);

        } catch (Exception e) {
            return 3; // safe fallback
        }
    }
}