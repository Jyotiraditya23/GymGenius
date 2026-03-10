package com.Jyotiraditya.FitnessWeb.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class StatusController {

    @GetMapping("/status")
    public Map<String, String> getStatus() {

        Map<String, String> response = new HashMap<>();

        response.put("status", "UP");
        response.put("service", "FitnessWeb Backend");
        response.put("message", "Backend is running successfully");

        return response;
    }
}