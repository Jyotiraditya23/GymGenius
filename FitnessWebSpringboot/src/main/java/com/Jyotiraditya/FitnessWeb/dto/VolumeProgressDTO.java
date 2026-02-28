package com.Jyotiraditya.FitnessWeb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class VolumeProgressDTO {

    private LocalDate date;
    private Integer totalVolume;
}