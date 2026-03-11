from fastapi import APIRouter
from pydantic import BaseModel

from ai.chatbot import generate_reply, save_chat, get_chat_history

router = APIRouter()

class ChatMessage(BaseModel):

    username: str
    message: str


@router.post("/chat")
def chat(data: ChatMessage):
    reply = generate_reply(data.message, data.username)
    save_chat(data.username, data.message, reply)
    return {"reply": reply}


@router.get("/chat/{username}")

def history(username: str):

    return get_chat_history(username)