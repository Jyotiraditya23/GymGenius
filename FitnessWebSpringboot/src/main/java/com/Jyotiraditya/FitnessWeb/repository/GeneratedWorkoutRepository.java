package com.Jyotiraditya.FitnessWeb.repository;

import com.Jyotiraditya.FitnessWeb.entity.GeneratedWorkoutEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GeneratedWorkoutRepository extends JpaRepository<GeneratedWorkoutEntity, Long> {
}
