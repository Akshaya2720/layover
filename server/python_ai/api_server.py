import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any

from ai_engine import generate_ai_quest, HAS_GENAI, GEMINI_KEY
from anam_client import avatar_manager

app = FastAPI(title="Wanderlore Python AI Microservice", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestRequest(BaseModel):
    genre: Optional[str] = "mystery"
    story_type: Optional[str] = "real"
    start_location: Optional[str] = "Kozhikode Beach, Beach Road"
    destination: Optional[str] = "Mananchira Square, Kozhikode"
    available_time: Optional[str] = "1 hour"
    difficulty: Optional[str] = "medium"
    budget: Optional[str] = "free"
    language: Optional[str] = "en"

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = "Kozhikode Heritage Adventure"

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "Wanderlore Python AI Microservice",
        "geminiLive": HAS_GENAI,
        "location": "Kozhikode (Calicut) UNESCO Literature City",
        "frontend": "http://localhost:5173"
    }

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "Wanderlore Python AI Service",
        "geminiLive": HAS_GENAI,
        "anamPython": avatar_manager.get_info(),
        "location": "Kozhikode (Calicut) UNESCO Literature City"
    }

@app.get("/anam/status")
def anam_status():
    return avatar_manager.get_info()

@app.post("/generate-quest")
def create_quest(req: QuestRequest):
    try:
        quest = generate_ai_quest(req.model_dump())
        return quest
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat-guide")
def chat_guide(req: ChatRequest):
    if HAS_GENAI:
        try:
            from google import genai
            client = genai.Client(api_key=GEMINI_KEY)
            resp = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=f"You are Cara, the Anam AI guide for Wanderlore in Kozhikode (UNESCO City of Literature). Keep responses warm, helpful, and concise (under 2 sentences). User says: '{req.message}'. Current Context: {req.context}."
            )
            return {"reply": resp.text.strip(), "engine": "google-genai-2.29"}
        except Exception as e:
            pass
    return {
        "reply": f"Greetings explorer! You are navigating Kozhikode. Observe your surroundings carefully to uncover the secret clue!",
        "engine": "kozhikode-heritage-archive"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5005)
