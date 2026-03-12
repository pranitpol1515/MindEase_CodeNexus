from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
import os
from pathlib import Path

# Ensure .env is loaded before reading key (in case this module is imported first)
try:
    from dotenv import load_dotenv
    _env = Path(__file__).resolve().parent.parent / ".env"
    load_dotenv(_env)
except Exception:
    pass

router = APIRouter()


class Message(BaseModel):
    text: str | None = None
    message: str | None = None  # frontend sends "message" (emoji chat + chatbot)
    language: str | None = "en"  # preferred language for AI response
    category: str | None = None  # career, academics, personal, other


# Used by both emoji chat (Scanner) and main Chatbot
_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
_client = genai.Client(api_key=_API_KEY) if _API_KEY else None


@router.post("/chat")
def chat(msg: Message):
    if _client is None:
        return {
            "reply": (
                "Gemini API key is not configured on the server. "
                "Please set GOOGLE_API_KEY or GEMINI_API_KEY."
            )
        }
    user_text = msg.text or msg.message or ""
    if not user_text.strip():
        return {"reply": "Please type something so I can support you."}

    lang = (msg.language or "en").lower()
    lang_instruction = ""
    if lang in ("hi", "mr", "ta", "te", "bn", "gu", "kn", "ml"):
        lang_map = {"hi": "Hindi", "mr": "Marathi", "ta": "Tamil", "te": "Telugu", "bn": "Bengali", "gu": "Gujarati", "kn": "Kannada", "ml": "Malayalam"}
        lang_instruction = f" Respond ONLY in {lang_map.get(lang, lang)} language.\n\n"

    cat = (msg.category or "").lower()
    cat_instruction = ""
    if cat in ("career", "academics", "personal", "other"):
        cat_map = {
            "career": "career, job, work-related stress and growth",
            "academics": "studies, exams, academic pressure and learning",
            "personal": "personal life, relationships, self-care and emotions",
            "other": "general wellbeing",
        }
        cat_instruction = f" Focus your support on: {cat_map[cat]}.\n\n"

    prompt = (
        "You are a helpful, personalized mental health support assistant. "
        "Provide empathetic and supportive responses. Keep responses concise."
        f"{lang_instruction}{cat_instruction}"
        f"User: {user_text}"
    )
    models_to_try = ["models/gemini-flash-latest", "models/gemini-pro-latest"]
    reply = None
    for model in models_to_try:
        try:
            response = _client.models.generate_content(model=model, contents=prompt)
            reply = (response.text or "").strip()
            break
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "quota" in err_str.lower():
                continue
            print(f"Error ({model}): {err_str}")
            reply = "I'm having trouble responding right now. Please try again in a moment."
            break
    if reply is None:
        reply = "Our AI service has reached its daily limit. Please try again later or tomorrow."

    return {"reply": reply}