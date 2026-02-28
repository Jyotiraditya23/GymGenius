from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from fastapi.responses import StreamingResponse
from typing import Optional
import os
import json
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    streaming=True
)

# 💪 Fitness System Prompt
FITNESS_SYSTEM_PROMPT = """
You are GymGenius AI, a friendly and experienced fitness coach.

STYLE RULES:
- Respond in a natural, conversational tone.
- Do NOT use markdown formatting like **bold** or numbered lists.
- Avoid robotic or textbook-style answers.
- Keep answers short (3–6 lines unless user asks for detail).
- Use simple spacing instead of 1., 2., 3.
- Speak like a real gym trainer talking to a client.

CONTENT RULES:
- Give practical advice.
- Focus on muscle building, fat loss, workouts, and nutrition.
- Encourage safe training.
- If question is outside fitness, politely redirect.

Be motivating but not cheesy.
"""

async def stream_chat(message: str, checkpoint_id: Optional[str]):
    yield f'data: {json.dumps({"type":"checkpoint","id":"fitness"})}\n\n'

    messages = [
        SystemMessage(content=FITNESS_SYSTEM_PROMPT),
        HumanMessage(content=message)
    ]

    async for chunk in llm.astream(messages):
        if chunk.content:
            yield f'data: {json.dumps({"type":"content","content":chunk.content})}\n\n'

    yield f'data: {json.dumps({"type":"end"})}\n\n'