package com.Jyotiraditya.FitnessWeb.repository;

import com.Jyotiraditya.FitnessWeb.entity.WorkoutProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface WorkoutProgressRepository
        extends JpaRepository<WorkoutProgress, Long> {

    List<WorkoutProgress> findByUserId(Long userId);

    List<WorkoutProgress> findByUserIdAndExerciseName(
            Long userId, String exerciseName);

    List<WorkoutProgress> findByUserIdAndDateBetween(
            Long userId, LocalDate start, LocalDate end);
    List<WorkoutProgress>
    findByUserIdAndMuscleGroupOrderByDateAsc(Long userId, String muscleGroup);

    @Query("""
       SELECT w.date, SUM(w.volume)
       FROM WorkoutProgress w
       WHERE w.userId = :userId
       AND w.muscleGroup = :muscleGroup
       GROUP BY w.date
       ORDER BY w.date ASC
       """)
    List<Object[]> getDailyVolumeByMuscle(
            @Param("userId") Long userId,
            @Param("muscleGroup") String muscleGroup
    );
}