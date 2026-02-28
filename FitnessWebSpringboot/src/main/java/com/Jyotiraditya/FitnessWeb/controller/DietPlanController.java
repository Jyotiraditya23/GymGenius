package com.Jyotiraditya.FitnessWeb.controller;

import com.Jyotiraditya.FitnessWeb.dto.AiDietRequestDTO;
import com.Jyotiraditya.FitnessWeb.dto.DietPlanDTO;
import com.Jyotiraditya.FitnessWeb.services.DietPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/diet")
@RequiredArgsConstructor
public class DietPlanController {

    private final DietPlanService dietPlanService;

    @GetMapping
    public List<DietPlanDTO> getAllDietPlans() {
        return dietPlanService.getAllDietPlans();
    }

    // Create Manual Diet Plan
    @PostMapping
    public DietPlanDTO create(@RequestBody DietPlanDTO dto) {
        return dietPlanService.createDietPlan(dto);
    }

    // Generate Diet From AI
    @PostMapping("/generate-custom")
    public ResponseEntity<DietPlanDTO> generateCustomDiet(
            @RequestBody AiDietRequestDTO request) {

        return ResponseEntity.ok(
                dietPlanService.generateCustomDiet(request)
        );
    }

    // Get Diet By ID
    @GetMapping("/{id}")
    public DietPlanDTO get(@PathVariable Long id) {
        return dietPlanService.getDietPlan(id);
    }

    // Update Diet
    @PutMapping("/{id}")
    public DietPlanDTO update(@PathVariable Long id,
                              @RequestBody DietPlanDTO dto) {
        return dietPlanService.updateDietPlan(id, dto);
    }

    // Delete Diet
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        dietPlanService.deleteDietPlan(id);
    }
}