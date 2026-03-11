import os
import random
import re
from datetime import datetime, timezone

from dotenv import load_dotenv
from google import genai

from database.database import chat_collection

load_dotenv()

_api_key = os.getenv("GEMINI_API_KEY")
if _api_key:
    _client = genai.Client(api_key=_api_key)
else:
    _client = None


def _pick_one(items: list[str]) -> str:
    return random.choice(items) if items else ""


def _fallback_reply(message: str) -> str:
    """
    Rule-based reply if OpenAI is not available.
    This is intentionally non-deterministic to avoid repeating the exact same text.
    """
    text = (message or "").lower()

    if any(word in text for word in ["suicide", "kill myself", "end my life"]):
        return _pick_one(
            [
                "I'm really glad you reached out. Your life matters. If you feel unsafe, please contact your local emergency number right now and tell someone you trust nearby.",
                "Thank you for telling me. You deserve real support. If you are in danger or might harm yourself, please call local emergency services or a crisis helpline immediately and reach out to a trusted person.",
            ]
        )
    if any(word in text for word in ["sad", "depressed", "down", "cry", "lonely", "hopeless"]):
        return _pick_one(
            [
                "I’m really sorry you’re carrying this. If you want, tell me what happened today. While we talk, try 5 slow breaths and a sip of water.",
                "That sounds heavy. One gentle step: write 1 worrying thought, then rewrite it in a kinder, more balanced way. What’s the thought that keeps coming back?",
                "I hear you. Let’s do a 2‑minute reset: inhale 4, hold 2, exhale 6. Then tell me what’s been the hardest part lately.",
                "Feeling low can be exhausting. If today had a tiny ‘1% better’ moment, what would it look like? We can aim for that together.",
            ]
        )
    if any(word in text for word in ["anxious", "anxiety", "worried", "panic"]):
        return _pick_one(
            [
                "Anxiety can feel intense, but it will pass. Try: inhale 4, hold 4, exhale 6 (repeat 5 times). What’s the biggest worry right now?",
                "Let’s ground you: 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. What triggered this feeling?",
                "If your chest feels tight, relax your jaw and drop your shoulders. Longer exhale helps most. Where are you right now—home, college, work?",
                "Let’s shrink the problem: what part is in your control today, and what part isn’t? We’ll make a small plan for the controllable part.",
            ]
        )
    if any(word in text for word in ["stressed", "stress", "overwhelmed", "burnout", "tired", "exhausted"]):
        return _pick_one(
            [
                "That sounds overwhelming. If we pick just ONE priority for the next hour, what should it be?",
                "Let’s do a quick reset: drink water, unclench your jaw, slow exhale. What’s the top 1–2 tasks making you feel overloaded?",
                "When you’re stressed, small structure helps. Try: 10 minutes focused, 2 minutes break. What are you trying to finish today?",
                "Burnout signals you’ve been carrying too much for too long. What’s one thing you can pause, delegate, or postpone this week?",
            ]
        )
    if any(word in text for word in ["angry", "frustrated", "irritated", "mad"]):
        return _pick_one(
            [
                "Anger makes sense. Before reacting, take a 60‑second pause. What exactly felt unfair or disrespectful?",
                "Let’s slow it down: what happened, what did you feel, and what did you need in that moment?",
                "Try a quick reset: unclench fists, slow exhale, sip water. Then we’ll choose a calm next step together.",
                "If you could say one sentence to the situation (without hurting anyone), what would it be? We can turn it into a respectful message.",
            ]
        )
    if any(word in text for word in ["confused", "lost", "what should i do", "help me decide", "decision"]):
        return _pick_one(
            [
                "I can help you decide. What are your options, and what matters most to you—peace, progress, relationships, health?",
                "Let’s make it simpler: what’s the best-case and worst-case for each option? Then we’ll pick the safest next step.",
                "Tell me the decision in one line. Then tell me what you’re afraid might happen.",
            ]
        )
    if any(word in text for word in ["angry", "frustrated", "irritated"]):
        return _pick_one(
            [
                "Anger makes sense. Before you react, take a 60-second pause. What exactly felt unfair or disrespectful?",
                "Let’s slow it down: what happened, what did you feel, and what did you need in that moment?",
                "Try a quick reset: unclench fists, slow exhale, sip water. Then we can figure out a calm next step together.",
            ]
        )
    if any(word in text for word in ["happy", "good", "excited", "grateful"]):
        return _pick_one(
            [
                "That’s great to hear. What’s one thing that contributed to this good mood today?",
                "Love that. If you want, describe the moment—what happened and how it felt?",
                "Nice! How can we help you keep this momentum going for the rest of the week?",
            ]
        )

    return _pick_one(
        [
            "Thanks for sharing. What’s the main thing on your mind right now?",
            "I’m here with you. If you had to name it in one word—how are you feeling?",
            "Tell me more—when did you start feeling this way?",
            "Let’s take it step by step. What happened right before you started feeling this way?",
            "You don’t have to handle this alone. What kind of support would feel most helpful right now—listening, a plan, or a distraction?",
        ]
    )


def _normalize_for_compare(text: str) -> str:
    # remove extra whitespace/punctuation for comparing repetition
    t = (text or "").lower()
    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"[^\w\s]", "", t)
    return t


def generate_reply(message: str, username: str | None = None) -> str:
    """
    Generate an AI reply.
    If OpenAI is not configured or fails, fall back to a safe rule-based response.
    """
    if not _client:
        return _fallback_reply(message)

    try:
        last_reply_text = None
        transcript = []

        if username:
            docs = (
                chat_collection.find({"username": username})
                .sort("created_at", -1)
                .limit(8)
            )
            docs_list = list(docs)
            docs_list.reverse()
            for d in docs_list:
                u = (d.get("message") or "").strip()
                a = (d.get("reply") or "").strip()
                if u:
                    transcript.append(f"User: {u}")
                if a:
                    transcript.append(f"Assistant: {a}")
                    last_reply_text = a

        system_text = (
            "You are a compassionate mental health counselor. "
            "Give calm, short, supportive, and non-judgmental guidance. "
            "Respond naturally to what the user just said. "
            "Avoid repeating the exact same sentences across turns. "
            "If the user seems in crisis, gently suggest contacting local emergency services "
            "or a trusted adult/professional."
        )

        prompt = (message or "").strip()
        if last_reply_text:
            prompt = (
                f"{prompt}\n\n"
                f"(Avoid repeating your previous reply verbatim: {last_reply_text!r}. "
                "Respond with fresh wording.)"
            )

        full_prompt = "\n".join(
            [
                system_text,
                "",
                "Conversation so far:",
                *transcript,
                "",
                f"User: {prompt}",
                "Assistant:",
            ]
        ).strip()

        model_name = os.getenv("GEMINI_MODEL", "models/gemini-2.0-flash")
        response = _client.models.generate_content(
            model=model_name,
            contents=full_prompt,
            config={
                "temperature": 1.15,
                "top_p": 0.95,
                "max_output_tokens": 220,
            },
        )

        reply = (getattr(response, "text", "") or "").strip()
        if not reply:
            return _fallback_reply(message)
        if last_reply_text and _normalize_for_compare(reply) == _normalize_for_compare(last_reply_text):
            return reply + " What’s one small detail that feels most important right now?"
        return reply
    except Exception as e:
        # Any error from Gemini: network, invalid key, rate limit, etc.
        try:
            print("Gemini chatbot error:", repr(e))
        except Exception:
            pass
        fb = _fallback_reply(message)
        # Avoid repeating the last stored reply when we fall back
        if last_reply_text and _normalize_for_compare(fb) == _normalize_for_compare(last_reply_text):
            return fb + " If you’d like, share one more detail so I can support you better."
        return fb


def save_chat(username: str, message: str, reply: str):
    chat_collection.insert_one(
        {
            "username": username,
            "message": message,
            "reply": reply,
            "created_at": datetime.now(timezone.utc),
        }
    )


def get_chat_history(username: str, limit: int = 50):
    docs = (
        chat_collection.find({"username": username})
        .sort("created_at", -1)
        .limit(limit)
    )
    history = []
    for d in docs:
        history.append(
            {
                "username": d.get("username"),
                "message": d.get("message"),
                "reply": d.get("reply"),
                "created_at": d.get("created_at"),
            }
        )
    return list(reversed(history))