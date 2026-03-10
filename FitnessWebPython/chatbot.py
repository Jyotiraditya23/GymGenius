from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_community.tools.tavily_search import TavilySearchResults
from typing import Optional
import json
from dotenv import load_dotenv

load_dotenv()

# 🔎 Web search tool
search_tool = TavilySearchResults(max_results=3)

# 🤖 Groq LLM
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    streaming=True
)

# 💪 Fitness system prompt
FITNESS_SYSTEM_PROMPT = """
You are GymGenius AI, a friendly and experienced fitness coach.

Speak like a real trainer.
Keep responses short and practical.
Focus on workouts, muscle building, fat loss and nutrition.
"""

async def stream_chat(message: str, checkpoint_id: Optional[str]):

    yield f'data: {json.dumps({"type":"checkpoint","id":"fitness"})}\n\n'

    messages = [
        SystemMessage(content=FITNESS_SYSTEM_PROMPT),
        HumanMessage(content=message)
    ]

    # 🔎 Check if web search is needed
    needs_search = any(word in message.lower() for word in [
        "latest","research","study","science","trend","news"
    ])

    if needs_search:

        # notify frontend search started
        yield f'data: {json.dumps({"type":"searching"})}\n\n'

        results = search_tool.invoke({"query": message})

        messages.append(
            SystemMessage(content=f"Web search results: {results}")
        )

    # 🤖 Stream LLM response
    async for chunk in llm.astream(messages):
        if chunk.content:
            yield f'data: {json.dumps({"type":"content","content":chunk.content})}\n\n'

    yield f'data: {json.dumps({"type":"end"})}\n\n'