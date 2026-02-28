package com.Jyotiraditya.FitnessWeb.services;

import com.Jyotiraditya.FitnessWeb.dto.*;
import com.Jyotiraditya.FitnessWeb.entity.DietMealEntity;
import com.Jyotiraditya.FitnessWeb.entity.DietPlanEntity;
import com.Jyotiraditya.FitnessWeb.entity.ProfileEntity;
import com.Jyotiraditya.FitnessWeb.repository.DietPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DietPlanService {

    private final DietPlanRepository dietPlanRepository;
    private final ProfileService profileService;
    private final FitnessProfileService fitnessProfileService;
    private final AIService aiService;


    public List<DietPlanDTO> getAllDietPlans() {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        List<DietPlanEntity> plans =
                dietPlanRepository.findByProfileId(currentProfile.getId());

        return plans.stream()
                .map(this::mapToDTO)
                .toList();
    }

    public DietPlanDTO createDietPlan(DietPlanDTO dto) {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        DietPlanEntity entity = DietPlanEntity.builder()
                .planName(dto.getPlanName())
                .totalCalories(dto.getTotalCalories())
                .protein(dto.getProtein())
                .carbs(dto.getCarbs())
                .fats(dto.getFats())
                .profile(currentProfile)
                .build();

        if (dto.getMeals() != null) {
            List<DietMealEntity> meals = dto.getMeals().stream()
                    .map(mealDTO -> DietMealEntity.builder()
                            .mealName(mealDTO.getMealName())
                            .mealType(mealDTO.getMealType())
                            .calories(mealDTO.getCalories())
                            .protein(mealDTO.getProtein())
                            .carbs(mealDTO.getCarbs())
                            .fats(mealDTO.getFats())
                            .recipe(mealDTO.getRecipe())
                            .dietPlan(entity)
                            .build())
                    .toList();

            entity.setMeals(meals);
        }

        DietPlanEntity saved = dietPlanRepository.save(entity);

        return mapToDTO(saved);
    }


    public DietPlanDTO generateCustomDiet(AiDietRequestDTO request) {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        FitnessProfileDTO fitness =
                fitnessProfileService.getCompleteInformation();

        request.setAge(fitness.getAge());
        request.setHeight(fitness.getHeight());
        request.setWeight(fitness.getWeight());
        request.setGoal(fitness.getGoal());

        if (request.getNote() == null || request.getNote().trim().isEmpty()) {
            request.setNote("No user specification");
        }

        AiDietResponseDTO aiResponse =
                aiService.generateDiet(request);
        aiResponse.setPlanName(request.getPlanName());

        return saveFromAiResponse(aiResponse, currentProfile);
    }

    private DietPlanDTO mapAiResponseToDTO(AiDietResponseDTO aiResponse) {

        DietPlanDTO dto = new DietPlanDTO();

        dto.setPlanName(aiResponse.getPlanName());
        dto.setTotalCalories(aiResponse.getTotalCalories());
        dto.setProtein(aiResponse.getProtein());
        dto.setCarbs(aiResponse.getCarbs());
        dto.setFats(aiResponse.getFats());

        if (aiResponse.getMeals() != null) {
            dto.setMeals(
                    aiResponse.getMeals().stream().map(meal -> {
                        DietMealDTO mealDTO = new DietMealDTO();
                        mealDTO.setMealName(meal.getMealName());
                        mealDTO.setMealType(meal.getMealType());
                        mealDTO.setCalories(meal.getCalories());
                        mealDTO.setProtein(meal.getProtein());
                        mealDTO.setCarbs(meal.getCarbs());
                        mealDTO.setFats(meal.getFats());
                        mealDTO.setRecipe(meal.getRecipe());
                        return mealDTO;
                    }).toList()
            );
        }

        return dto;
    }

    public DietPlanDTO getDietPlan(Long id) {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        DietPlanEntity entity = dietPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diet plan not found"));

        if (!entity.getProfile().getId().equals(currentProfile.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        return mapToDTO(entity);
    }

    public DietPlanDTO updateDietPlan(Long id, DietPlanDTO dto) {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        DietPlanEntity entity = dietPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diet plan not found"));

        if (!entity.getProfile().getId().equals(currentProfile.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        entity.setPlanName(dto.getPlanName());
        entity.setTotalCalories(dto.getTotalCalories());
        entity.setProtein(dto.getProtein());
        entity.setCarbs(dto.getCarbs());
        entity.setFats(dto.getFats());

        return mapToDTO(dietPlanRepository.save(entity));
    }

    public void deleteDietPlan(Long id) {

        ProfileEntity currentProfile = profileService.getCurrentProfile();

        DietPlanEntity entity = dietPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diet plan not found"));

        if (!entity.getProfile().getId().equals(currentProfile.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        dietPlanRepository.delete(entity);
    }

    private DietPlanDTO saveFromAiResponse(
            AiDietResponseDTO aiResponse,
            ProfileEntity profile) {

        DietPlanEntity entity = DietPlanEntity.builder()
                .planName(aiResponse.getPlanName())
                .totalCalories(aiResponse.getTotalCalories())
                .protein(aiResponse.getProtein())
                .carbs(aiResponse.getCarbs())
                .fats(aiResponse.getFats())
                .profile(profile)
                .build();

        if (aiResponse.getMeals() != null) {
            List<DietMealEntity> meals = aiResponse.getMeals().stream()
                    .map(meal -> DietMealEntity.builder()
                            .mealName(meal.getMealName())
                            .mealType(meal.getMealType())
                            .calories(meal.getCalories())
                            .protein(meal.getProtein())
                            .carbs(meal.getCarbs())
                            .fats(meal.getFats())
                            .recipe(meal.getRecipe())
                            .dietPlan(entity)
                            .build())
                    .toList();

            entity.setMeals(meals);
        }

        DietPlanEntity saved = dietPlanRepository.save(entity);

        return mapToDTO(saved);
    }

    private DietPlanDTO mapToDTO(DietPlanEntity entity) {

        DietPlanDTO dto = new DietPlanDTO();
        dto.setId(entity.getId());
        dto.setPlanName(entity.getPlanName());
        dto.setTotalCalories(entity.getTotalCalories());
        dto.setProtein(entity.getProtein());
        dto.setCarbs(entity.getCarbs());
        dto.setFats(entity.getFats());

        if (entity.getMeals() != null) {
            dto.setMeals(
                    entity.getMeals().stream()
                            .map(meal -> {
                                DietMealDTO mealDTO = new DietMealDTO();
                                mealDTO.setId(meal.getId());
                                mealDTO.setMealName(meal.getMealName());
                                mealDTO.setMealType(meal.getMealType());
                                mealDTO.setCalories(meal.getCalories());
                                mealDTO.setProtein(meal.getProtein());
                                mealDTO.setCarbs(meal.getCarbs());
                                mealDTO.setFats(meal.getFats());
                                mealDTO.setRecipe(meal.getRecipe());
                                return mealDTO;
                            })
                            .toList()
            );
        }

        return dto;
    }
}