from fastapi import APIRouter
from database.database import mood_collection
from models.user import Mood

router = APIRouter()

@router.post("/mood")
def save_mood(data: Mood):

    mood_collection.insert_one({
        "username": data.username,
        "mood": data.mood
    })

    return {"message": "mood saved"}