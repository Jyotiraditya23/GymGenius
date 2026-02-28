package com.Jyotiraditya.FitnessWeb.repository;

import com.Jyotiraditya.FitnessWeb.entity.DietPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DietPlanRepository extends JpaRepository<DietPlanEntity, Long> {
    List<DietPlanEntity> findByProfileId(Long profileId);
}
