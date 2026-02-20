package com.Jyotiraditya.FitnessWeb.controller;

import com.Jyotiraditya.FitnessWeb.dto.FitnessProfileDTO;
import com.Jyotiraditya.FitnessWeb.entity.FitnessProfileEntity;
import com.Jyotiraditya.FitnessWeb.services.FitnessProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fitnessProfile")
public class FitnessProfileController {

    private final FitnessProfileService fitnessProfileService;

    @GetMapping
    public ResponseEntity<FitnessProfileDTO> getProfile(){
        return ResponseEntity.ok(fitnessProfileService.getCompleteInformation());
    }

    @PostMapping
    public ResponseEntity<FitnessProfileDTO> addProfileInfo(
            @RequestBody FitnessProfileDTO dto){

        return ResponseEntity.ok(
                fitnessProfileService.addFitnessInformation(dto)
        );
    }

    @PutMapping
    public ResponseEntity<FitnessProfileDTO> updateProfileInfo(
            @RequestBody FitnessProfileDTO dto){

        return ResponseEntity.ok(
                fitnessProfileService.updateInformation(dto)
        );
    }

    @DeleteMapping
    public ResponseEntity<String> deleteProfileInfo(){
        fitnessProfileService.deleteInformation();
        return ResponseEntity.ok("Successfully Deleted");
    }
}

