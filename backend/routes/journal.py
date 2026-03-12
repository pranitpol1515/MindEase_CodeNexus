"""Journal and communities routes."""
from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
import os
from pathlib import Path
from datetime import datetime

try:
    from dotenv import load_dotenv
    _env = Path(__file__).resolve().parent.parent / ".env"
    load_dotenv(_env)
except Exception:
    pass

from database.database import (
    journal_collection,
    communities_collection,
    community_messages_collection,
    community_members_collection,
    playlist_collection,
)

router = APIRouter()

_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
_client = genai.Client(api_key=_API_KEY) if _API_KEY else None


class JournalSave(BaseModel):
    username: str
    text: str


@router.post("/journal/save")
def journal_save(body: JournalSave):
    summary = ""
    if _client and body.text.strip():
        try:
            response = _client.models.generate_content(
                model="models/gemini-flash-latest",
                contents=f"""Provide a brief, gentle 1-2 sentence reflection/summary of this journal entry. Be supportive and non-judgmental.
Journal: {body.text[:1500]}""",
            )
            summary = (response.text or "").strip()
        except Exception:
            pass
    doc = {
        "username": body.username,
        "text": body.text,
        "summary": summary,
        "created_at": datetime.utcnow().isoformat(),
    }
    journal_collection.insert_one(doc)
    return {"message": "saved", "entry": {"summary": summary}}


@router.get("/journal/latest/{username}")
def journal_latest(username: str, limit: int = 1):
    entries = []
    for e in journal_collection.find({"username": username}).sort("created_at", -1).limit(limit):
        entries.append({"id": str(e["_id"]), "text": e.get("text", ""), "summary": e.get("summary", "")})
    return {"entries": entries}


@router.get("/communities/{username}")
def get_communities(username: str):
    # Ensure default communities exist
    defaults = [
        {"slug": "anxiety-support", "name": "Anxiety support", "description": "A safe space for anxiety"},
        {"slug": "low-mood", "name": "Low mood", "description": "Gentle support for low days"},
        {"slug": "sleep", "name": "Sleep & rest", "description": "Better sleep tips"},
    ]
    for d in defaults:
        communities_collection.update_one({"slug": d["slug"]}, {"$setOnInsert": d}, upsert=True)
    communities = []
    for c in communities_collection.find({}):
        joined = community_members_collection.find_one({"username": username, "community_slug": c["slug"]}) is not None
        communities.append({"slug": c["slug"], "name": c["name"], "joined": joined})
    return {"communities": communities}


@router.post("/communities/join")
def community_join(body: dict):
    community_members_collection.insert_one({
        "username": body["username"],
        "community_slug": body["community_slug"],
    })
    return {"message": "joined"}


@router.post("/communities/leave")
def community_leave(body: dict):
    community_members_collection.delete_one({
        "username": body["username"],
        "community_slug": body["community_slug"],
    })
    return {"message": "left"}


@router.get("/communities/{slug}/messages")
def get_messages(slug: str):
    messages = []
    for m in community_messages_collection.find({"community_slug": slug}).sort("created_at", 1):
        messages.append({"id": str(m["_id"]), "username": m.get("username", ""), "text": m.get("text", "")})
    return {"messages": messages}


@router.post("/communities/message")
def post_message(body: dict):
    community_messages_collection.insert_one({
        "username": body["username"],
        "community_slug": body["community_slug"],
        "text": body["text"],
        "created_at": datetime.utcnow().isoformat(),
    })
    return {"message": "sent"}


@router.get("/playlists")
def get_playlists():
    doc = playlist_collection.find_one({})
    return {
        "motivation_urls": doc.get("motivation_urls", []) if doc else [],
        "meditation_urls": doc.get("meditation_urls", []) if doc else [],
    }


@router.get("/insights/quote-of-day/{username}")
def quote_of_day(username: str):
    if _client:
        try:
            response = _client.models.generate_content(
                model="models/gemini-flash-latest",
                contents="Generate one short, gentle affirmation or quote for the day (1-2 sentences). Be supportive.",
            )
            return {"text": (response.text or "").strip()}
        except Exception:
            pass
    return {"text": "You are allowed to move slowly. Showing up for yourself still counts as progress."}
