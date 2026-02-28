package com.Jyotiraditya.FitnessWeb.services;

import com.Jyotiraditya.FitnessWeb.dto.AiDietRequestDTO;
import com.Jyotiraditya.FitnessWeb.dto.AiDietResponseDTO;
import com.Jyotiraditya.FitnessWeb.dto.aiworkoutplan.AiWorkoutRequestDTO;
import com.Jyotiraditya.FitnessWeb.dto.aiworkoutplan.AiWorkoutResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AIService {

    private final WebClient webClient;

    public AiWorkoutResponseDTO generateWorkout(AiWorkoutRequestDTO request) {

        return webClient.post()
                .uri("/generate-workout") // FastAPI endpoint
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request) // Sends JSON automatically
                .retrieve()
                .onStatus(
                        status -> status.isError(),
                        response -> response.bodyToMono(String.class)
                                .map(error -> new RuntimeException("AI Service Error: " + error))
                )
                .bodyToMono(AiWorkoutResponseDTO.class)
                .block(); // waits for response (sync call)
    }
    public AiDietResponseDTO generateDiet(AiDietRequestDTO request) {

        return webClient.post()
                .uri("/generate-diet")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiDietResponseDTO.class)
                .block();
    }
}
