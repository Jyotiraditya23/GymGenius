from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Optional

app = FastAPI()

# -------- Request Model --------
class WorkoutRequest(BaseModel):
    age: int
    height: float
    weight: float
    goal: str
    workoutDaysPerWeek: int
    difficulty: str
    preferredMuscleSplit: Optional[Dict[str, str]] = None


# -------- Response Models --------
class Exercise(BaseModel):
    name: str
    sets: int
    reps: int
    notes: str

class WorkoutDay(BaseModel):
    day: str
    muscleGroup: str
    exercises: List[Exercise]

class AiWorkoutResponseDTO(BaseModel):
    planName: str
    days: List[WorkoutDay]


# -------- API Endpoint --------
@app.post("/generate-workout", response_model=AiWorkoutResponseDTO)
def generate_workout(req: WorkoutRequest):

    # 🔥 PRINT DATA RECEIVED FROM SPRING BOOT
    print("\n==== DATA RECEIVED FROM SPRING BOOT ====")
    print(req.model_dump())
    print("=======================================\n")

    # 🔥 Generate workout based on preferredMuscleSplit
    workout_days = []

    if req.preferredMuscleSplit:
        for day, muscle in req.preferredMuscleSplit.items():
            workout_days.append(
                WorkoutDay(
                    day=day,
                    muscleGroup=muscle,
                    exercises=[
                        Exercise(
                            name=f"{muscle} Exercise 1",
                            sets=4,
                            reps=10,
                            notes="Focus on proper form"
                        ),
                        Exercise(
                            name=f"{muscle} Exercise 2",
                            sets=3,
                            reps=12,
                            notes="Controlled movement"
                        )
                    ]
                )
            )
    else:
        # fallback if no split provided
        workout_days.append(
            WorkoutDay(
                day="Monday",
                muscleGroup="Full Body",
                exercises=[
                    Exercise(name="Squats", sets=4, reps=10, notes="Keep posture straight"),
                    Exercise(name="Push Ups", sets=3, reps=15, notes="Controlled tempo")
                ]
            )
        )

    return AiWorkoutResponseDTO(
        planName="AI Personalized Plan",
        days=workout_days
    )