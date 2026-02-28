from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from chatbot import stream_chat
from workout_graph import workout_graph, WorkoutRequest, AiWorkoutResponseDTO
from diet_graph import diet_graph, AiDietRequest, AiDietResponse
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.post("/generate-workout", response_model=AiWorkoutResponseDTO)
def generate_workout(req: WorkoutRequest):

    result = workout_graph.invoke({"input": req})

    return result["parsed_output"]

@app.post("/generate-diet", response_model=AiDietResponse)
def generate_diet(req: AiDietRequest):

    result = diet_graph.invoke({"input": req})

    return result["parsed_output"]


@app.get("/chat_stream/{message}")
async def chat_stream(message: str, checkpoint_id: str | None = None):
    return StreamingResponse(
        stream_chat(message, checkpoint_id),
        media_type="text/event-stream"
    )