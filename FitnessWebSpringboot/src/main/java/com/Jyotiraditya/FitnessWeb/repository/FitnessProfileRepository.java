package com.Jyotiraditya.FitnessWeb.repository;

import com.Jyotiraditya.FitnessWeb.entity.FitnessProfileEntity;
import com.Jyotiraditya.FitnessWeb.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FitnessProfileRepository extends JpaRepository<FitnessProfileEntity, Long> {

    Optional<FitnessProfileEntity> findByProfileEntity(ProfileEntity profileEntity);
}
