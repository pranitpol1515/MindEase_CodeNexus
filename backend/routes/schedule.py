"""Day planning and insights routes."""
from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
import os
from pathlib import Path

try:
    from dotenv import load_dotenv
    _env = Path(__file__).resolve().parent.parent / ".env"
    load_dotenv(_env)
except Exception:
    pass

router = APIRouter()

_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
_client = genai.Client(api_key=_API_KEY) if _API_KEY else None


class DayPlanRequest(BaseModel):
    username: str
    problem: str
    current_schedule: str | None = None
    language: str | None = "en"


@router.post("/schedule/day-plan")
def create_day_plan(body: DayPlanRequest):
    if _client is None:
        return {"rows": [], "error": "Gemini API key not configured"}
    try:
        prompt = f"""You are a supportive day planning assistant. The user says:
"{body.problem}"

{f'Their current/typical day: {body.current_schedule}' if body.current_schedule else ''}

Create a gentle, realistic daily schedule as a table. Return ONLY valid JSON array of objects, each with keys: time, activity, notes.
Respond in the user's language if they wrote in Hindi, Marathi, or another Indian language; otherwise use English.
Example format: [{{"time":"7:00 AM","activity":"Wake up & gentle stretch","notes":"Take your time"}}, ...]
Include 8-12 time slots covering morning to evening. Be empathetic and practical."""
        response = _client.models.generate_content(
            model="models/gemini-flash-latest",
            contents=prompt,
        )
        text = (response.text or "").strip()
        # Extract JSON from response (may be wrapped in ```json)
        if "```" in text:
            start = text.find("[")
            end = text.rfind("]") + 1
            if start >= 0 and end > start:
                text = text[start:end]
        import json
        rows = json.loads(text)
        if not isinstance(rows, list):
            rows = []
        return {"rows": rows}
    except Exception as e:
        err = str(e)
        if "429" in err or "RESOURCE_EXHAUSTED" in err or "quota" in err.lower():
            return {"rows": [], "error": "AI service limit reached. Please try again later."}
        return {"rows": [], "error": "Could not generate schedule. Please try again."}


class DailyReportRequest(BaseModel):
    username: str
    language: str | None = "en"


@router.post("/insights/daily-report")
def daily_report(body: DailyReportRequest):
    if _client is None:
        return {"summary": "Analysis service is not available. Please try again later."}
    try:
        lang = body.language or "en"
        lang_guide = "Hindi" if lang == "hi" else ("Marathi" if lang == "mr" else "English")
        prompt = f"""You are a gentle mental wellness assistant. Generate a short, supportive daily check-in report for user "{body.username}".
Since we don't have access to their actual mood data, journal, or chat history in this request, create a general encouraging daily reflection.
Include: 1-2 gentle affirmations, a brief note about being kind to oneself, and a small actionable tip for the day.
Keep it warm, brief (3-4 sentences), and supportive. Write in a friendly, caring tone.
IMPORTANT: Write the entire response in {lang_guide} only."""
        response = _client.models.generate_content(
            model="models/gemini-flash-latest",
            contents=prompt,
        )
        return {"summary": (response.text or "").strip()}
    except Exception as e:
        err = str(e)
        if "429" in err or "RESOURCE_EXHAUSTED" in err or "quota" in err.lower():
            return {"summary": "Our AI service has reached its daily limit. Please try again tomorrow."}
        return {"summary": "Unable to generate report right now. Please try again later."}
