from fastapi import APIRouter
from pydantic import BaseModel
from ai.emotion_detection import detect_emotion

router = APIRouter()

class ImageData(BaseModel):
    image:str

@router.post("/detect-emotion")
def detect(data:ImageData):

    emotion,suggestion = detect_emotion(data.image)

    return {
        "emotion":emotion,
        "suggestion":suggestion
    }