# from fastapi import FastAPI
# from pydantic import BaseModel
# from typing import List, Dict, Optional
#
# app = FastAPI()
#
# # -------- Request Model --------
# class WorkoutRequest(BaseModel):
#     age: int
#     height: float
#     weight: float
#     goal: str
#     workoutDaysPerWeek: int
#     difficulty: str
#     preferredMuscleSplit: Optional[Dict[str, str]] = None
#
#
# # -------- Response Models --------
# class Exercise(BaseModel):
#     name: str
#     sets: int
#     reps: int
#     notes: str
#
# class WorkoutDay(BaseModel):
#     day: str
#     muscleGroup: str
#     exercises: List[Exercise]
#
# class AiWorkoutResponseDTO(BaseModel):
#     planName: str
#     days: List[WorkoutDay]
#
#
# # -------- API Endpoint --------
# @app.post("/generate-workout", response_model=AiWorkoutResponseDTO)
# def generate_workout(req: WorkoutRequest):
#
#     # 🔥 PRINT DATA RECEIVED FROM SPRING BOOT
#     print("\n==== DATA RECEIVED FROM SPRING BOOT ====")
#     print(req.model_dump())
#     print("=======================================\n")
#
#     # 🔥 Generate workout based on preferredMuscleSplit
#     workout_days = []
#
#     if req.preferredMuscleSplit:
#         for day, muscle in req.preferredMuscleSplit.items():
#             workout_days.append(
#                 WorkoutDay(
#                     day=day,
#                     muscleGroup=muscle,
#                     exercises=[
#                         Exercise(
#                             name=f"{muscle} Exercise 1",
#                             sets=4,
#                             reps=10,
#                             notes="Focus on proper form"
#                         ),
#                         Exercise(
#                             name=f"{muscle} Exercise 2",
#                             sets=3,
#                             reps=12,
#                             notes="Controlled movement"
#                         )
#                     ]
#                 )
#             )
#     else:
#         # fallback if no split provided
#         workout_days.append(
#             WorkoutDay(
#                 day="Monday",
#                 muscleGroup="Full Body",
#                 exercises=[
#                     Exercise(name="Squats", sets=4, reps=10, notes="Keep posture straight"),
#                     Exercise(name="Push Ups", sets=3, reps=15, notes="Controlled tempo")
#                 ]
#             )
#         )
#
#     return AiWorkoutResponseDTO(
#         planName="AI Personalized Plan",
#         days=workout_days
#     )
#
#
# # Request Model (must match Spring AiDietRequestDTO)
# class AiDietRequest(BaseModel):
#     age: int
#     height: float
#     weight: float
#     goal: str
#     workoutDaysPerWeek: int
#
#
# # Response Models
# class Meal(BaseModel):
#     mealName: str
#     mealType: str
#     calories: int
#     protein: int
#     carbs: int
#     fats: int
#     recipe: str
#
#
# class AiDietResponse(BaseModel):
#     planName: str
#     totalCalories: int
#     protein: int
#     carbs: int
#     fats: int
#     meals: List[Meal]
#
#
# @app.post("/generate-diet", response_model=AiDietResponse)
# def generate_diet(request: AiDietRequest):
#     print("Received from Spring Boot:", request)
#
#     return {
#         "planName": "Muscle Gain Advanced Plan",
#         "totalCalories": 2800,
#         "protein": 180,
#         "carbs": 320,
#         "fats": 80,
#         "meals": [
#             {
#                 "mealName": "Breakfast",
#                 "mealType": "VEG",
#                 "calories": 600,
#                 "protein": 40,
#                 "carbs": 70,
#                 "fats": 20,
#                 "recipe": "Oats with peanut butter and banana"
#             },
#             {
#                 "mealName": "Lunch",
#                 "mealType": "NON-VEG",
#                 "calories": 900,
#                 "protein": 70,
#                 "carbs": 100,
#                 "fats": 25,
#                 "recipe": "Grilled chicken breast with rice"
#             },
#             {
#                 "mealName": "Dinner",
#                 "mealType": "VEG",
#                 "calories": 800,
#                 "protein": 50,
#                 "carbs": 90,
#                 "fats": 30,
#                 "recipe": "Paneer curry with roti"
#             }
#         ]
#     }


from fastapi import FastAPI
from workout_graph import workout_graph, WorkoutRequest, AiWorkoutResponseDTO
from diet_graph import diet_graph, AiDietRequest, AiDietResponse

app = FastAPI()

@app.post("/generate-workout", response_model=AiWorkoutResponseDTO)
def generate_workout(req: WorkoutRequest):

    result = workout_graph.invoke({"input": req})

    return result["parsed_output"]

@app.post("/generate-diet", response_model=AiDietResponse)
def generate_diet(req: AiDietRequest):

    result = diet_graph.invoke({"input": req})

    return result["parsed_output"]

