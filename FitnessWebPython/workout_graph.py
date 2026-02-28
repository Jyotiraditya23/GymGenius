from typing import TypedDict
from langgraph.graph import StateGraph
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

# =========================
# 🔑 GROQ LLM
# =========================

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY")
)

# =========================
# 📦 REQUEST + RESPONSE
# =========================

class WorkoutRequest(BaseModel):
    age: int
    height: float
    weight: float
    goal: str
    workoutDaysPerWeek: int
    difficulty: str
    preferredMuscleSplit: Optional[Dict[str, str]] = None


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


# =========================
# 🧠 LANGGRAPH STATE
# =========================

class WorkoutState(TypedDict):
    input: WorkoutRequest
    raw_output: str
    parsed_output: dict


# =========================
# 🔥 NODE 1: Generate
# =========================

def generate_workout_node(state: WorkoutState):

    req = state["input"]

    system_prompt = """You are a fitness expert API. You ONLY respond with raw valid JSON.
No markdown, no code blocks, no backticks, no explanation. Just pure JSON."""

    prompt = f"""
Create a structured gym workout plan for this user and return ONLY raw JSON with no markdown or code blocks.

User Profile:
- Age: {req.age}
- Height: {req.height} cm
- Weight: {req.weight} kg
- Goal: {req.goal}
- Days per week: {req.workoutDaysPerWeek}
- Difficulty: {req.difficulty}
- Preferred split: {req.preferredMuscleSplit}

You MUST return JSON that exactly matches this structure:
{{
  "planName": "string - descriptive plan name",
  "days": [
    {{
      "day": "string - e.g. Monday",
      "muscleGroup": "string - e.g. Chest & Triceps",
      "exercises": [
        {{
          "name": "string - exercise name",
          "sets": integer,
          "reps": integer,
          "notes": "string - form tips"
        }}
      ]
    }}
  ]
}}

Generate exactly {req.workoutDaysPerWeek} days. Return raw JSON only.
"""

    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=prompt)
    ])

    return {"raw_output": response.content}


# =========================
# 🔥 NODE 2: Parse JSON
# =========================

def clean_json(raw: str) -> str:
    """Strip markdown code fences if LLM wraps response in them."""
    # Remove ```json ... ``` or ``` ... ```
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return raw.strip()


def parse_workout_node(state: WorkoutState):
    raw = state["raw_output"]

    try:
        cleaned = clean_json(raw)
        parsed = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"LLM returned invalid JSON.\nError: {e}\nRaw output:\n{raw}")

    return {"parsed_output": parsed}


# =========================
# 🚀 BUILD GRAPH
# =========================

builder = StateGraph(WorkoutState)

builder.add_node("generate", generate_workout_node)
builder.add_node("parse", parse_workout_node)

builder.set_entry_point("generate")
builder.add_edge("generate", "parse")
builder.set_finish_point("parse")

workout_graph = builder.compile()