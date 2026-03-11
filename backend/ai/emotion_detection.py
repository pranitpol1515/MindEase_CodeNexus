from deepface import DeepFace
import base64
import cv2
import numpy as np

def detect_emotion(image_data):

    image_data = image_data.split(",")[1]
    image_bytes = base64.b64decode(image_data)

    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)

    # DeepFace can return a list or a dict depending on version
    if isinstance(result, list):
        first = result[0]
    else:
        first = result

    # Fallback if dominant_emotion is missing
    emotion = first.get("dominant_emotion")
    if not emotion and "emotion" in first:
        scores = first["emotion"]
        if isinstance(scores, dict) and scores:
            emotion = max(scores, key=scores.get)
    if not emotion:
        emotion = "neutral"

    suggestion = get_suggestion(emotion)

    return emotion, suggestion


def get_suggestion(emotion):

    emotion = (emotion or "").lower()

    if emotion in ("sad", "depressed", "down"):
        return "Try listening to music or talking with a friend."

    if emotion in ("angry", "mad", "frustrated"):
        return "Take deep breaths and relax for a few minutes."

    if emotion in ("happy", "joy", "excited"):
        return "Great! Keep doing things that make you happy."

    if emotion in ("fear", "scared", "anxious"):
        return "You are safe. Focus on slow breathing and grounding exercises."

    return "Take a short break, breathe slowly, and do something that relaxes you."