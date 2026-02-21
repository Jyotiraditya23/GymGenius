from typing import TypedDict
from langgraph.graph import StateGraph
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel
from typing import List
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY")
)


class AiDietRequest(BaseModel):
    age: int
    height: float
    weight: float
    goal: str
    workoutDaysPerWeek: int


class Meal(BaseModel):
    mealName: str
    mealType: str
    calories: int
    protein: int
    carbs: int
    fats: int
    recipe: str


class AiDietResponse(BaseModel):
    planName: str
    totalCalories: int
    protein: int
    carbs: int
    fats: int
    meals: List[Meal]



class DietState(TypedDict):
    input: AiDietRequest
    raw_output: str
    parsed_output: dict



def generate_diet_node(state: DietState):

    req = state["input"]

    system_prompt = """You are a nutrition expert API. You ONLY respond with raw valid JSON.
No markdown, no code blocks, no backticks, no explanation. Just pure JSON."""

    prompt = f"""
Create a detailed Indian diet plan for this user and return ONLY raw JSON with no markdown or code blocks.

User Profile:
- Age: {req.age}
- Height: {req.height} cm
- Weight: {req.weight} kg
- Goal: {req.goal}
- Workout Days per Week: {req.workoutDaysPerWeek}

You MUST return JSON that exactly matches this structure:
{{
  "planName": "string - descriptive plan name",
  "totalCalories": integer - total daily calories,
  "protein": integer - total daily protein in grams,
  "carbs": integer - total daily carbs in grams,
  "fats": integer - total daily fats in grams,
  "meals": [
    {{
      "mealName": "string - e.g. Breakfast",
      "mealType": "string - VEG or NON-VEG",
      "calories": integer,
      "protein": integer,
      "carbs": integer,
      "fats": integer,
      "recipe": "string - brief preparation description"
    }}
  ]
}}

Include meals for: Breakfast, Mid-Morning Snack, Lunch, Evening Snack, and Dinner.
All meals must be Indian food. Return raw JSON only.
"""

    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=prompt)
    ])

    return {"raw_output": response.content}


def clean_json(raw: str) -> str:
    """to remove not proper json provided by llm"""
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return raw.strip()


def parse_diet_node(state: DietState):
    raw = state["raw_output"]

    try:
        cleaned = clean_json(raw)
        parsed = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"LLM returned invalid JSON.\nError: {e}\nRaw output:\n{raw}")

    return {"parsed_output": parsed}



builder = StateGraph(DietState)

builder.add_node("generate", generate_diet_node)
builder.add_node("parse", parse_diet_node)

builder.set_entry_point("generate")
builder.add_edge("generate", "parse")
builder.set_finish_point("parse")

diet_graph = builder.compile()