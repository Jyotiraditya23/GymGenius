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

# =========================
# 📦 REQUEST + RESPONSE
# =========================

class AiDietRequest(BaseModel):
    age: int
    height: float
    weight: float
    goal: str
    targetCalories: int
    targetProtein: int
    targetCarbs: int
    targetFats: int
    note: str


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


# =========================
# 🧠 STATE
# =========================

class DietState(TypedDict):
    input: AiDietRequest
    raw_output: str
    parsed_output: dict


# =========================
# 🔥 NODE 1: Generate Diet
# =========================

def generate_diet_node(state: DietState):

    req = state["input"]

    system_prompt = """You are a nutrition expert API.
You ONLY respond with raw valid JSON.
No markdown, no code blocks, no explanation.
The total macros must closely match the user's target values."""

    # Ensure note always exists
    user_note = req.note if req.note else "No user specification"

    prompt = f"""
Create a detailed Indian diet plan strictly matching these macro targets.

User Profile:
- Age: {req.age}
- Height: {req.height} cm
- Weight: {req.weight} kg
- Goal: {req.goal}

TARGET MACROS (IMPORTANT — must match closely):
- Calories: {req.targetCalories}
- Protein: {req.targetProtein} g
- Carbs: {req.targetCarbs} g
- Fats: {req.targetFats} g

User Note:
{user_note}

You MUST:
- Keep total calories within ±50 kcal
- Keep macros within ±5g tolerance
- Use Indian budget-friendly foods
- Include: Breakfast, Mid-Morning Snack, Lunch, Evening Snack, Dinner

Return ONLY raw JSON in this exact structure:

{{
  "planName": "string",
  "totalCalories": integer,
  "protein": integer,
  "carbs": integer,
  "fats": integer,
  "meals": [
    {{
      "mealName": "string",
      "mealType": "VEG or NON-VEG",
      "calories": integer,
      "protein": integer,
      "carbs": integer,
      "fats": integer,
      "recipe": "string"
    }}
  ]
}}
"""

    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=prompt)
    ])

    return {"raw_output": response.content}

# =========================
# 🔥 NODE 2: Parse
# =========================

def clean_json(raw: str) -> str:
    """Strip markdown code fences if LLM wraps response in them."""
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

"""# Graph

┌───────────────┐
│   generate    │
│ generate_diet │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│     parse     │
│ parse_diet    │
└───────────────┘
"""