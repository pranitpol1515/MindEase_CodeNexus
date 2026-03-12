from fastapi import APIRouter
from database.database import mood_collection
from models.user import Mood
from ai.emotion_detection import detect_emotion, get_mental_advice
from pydantic import BaseModel

router = APIRouter()

class EmotionRequest(BaseModel):
    image: str  # base64 encoded image

@router.post("/mood")
def save_mood(data:Mood):
    mood_collection.insert_one({"mood":data.mood})
    return {"message":"mood saved"}

@router.get("/mood")
def get_moods():
    moods = []
    for m in mood_collection.find():
        moods.append({"id": str(m["_id"]), "mood": m["mood"]})
    return moods

@router.post("/detect-emotion")
def detect_face_emotion(request: EmotionRequest):
    emotion, confidence = detect_emotion(request.image)
    advice = get_mental_advice(emotion)
    return {
        "emotion": emotion,
        "confidence": confidence,
        "advice": advice
    }