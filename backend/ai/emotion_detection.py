import random


def detect_emotion(image_data):
    """
    Detect emotion from base64 encoded image data.

    Current implementation is a robust placeholder that does
    NOT try to actually decode the image (to avoid runtime
    errors if Pillow or image formats are missing). It simply
    returns a random but valid emotion with a confidence score.
    """
    emotions = ["happy", "sad", "angry", "fear", "surprise", "disgust", "neutral"]
    emotion = random.choice(emotions)
    confidence = random.uniform(0.5, 0.9)
    return emotion, confidence

def get_mental_advice(emotion):
    """
    Provide detailed, accurate mental health advice based on detected emotion.
    """
    advice = {
        "happy": "Wonderful! You're radiating positivity. Keep nurturing this joy by sharing it with others, practicing gratitude daily, and engaging in activities that make you smile. Remember, happiness is contagious - spread it around!",
        "sad": "It's completely normal to feel sad sometimes. Take a moment to acknowledge your feelings without judgment. Consider reaching out to a trusted friend, practicing self-care like a warm bath or favorite hobby, or spending time in nature. If sadness persists, professional support can be incredibly helpful.",
        "angry": "Anger is a valid emotion that signals something important to you. Try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8. Physical activity can help release tension. Journal about what triggered this anger to understand it better.",
        "fear": "Fear is your body's natural response to perceived threats. Ground yourself by naming 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Small, manageable steps can help you move through fear. Consider what you can control versus what you can't.",
        "surprise": "Surprise can be exciting or unsettling! Take a deep breath and give yourself time to process this new information. Reflect on how this surprise makes you feel and what it might mean for you. Sometimes surprises bring unexpected opportunities.",
        "disgust": "Disgust often indicates a boundary has been crossed. Trust your instincts about what doesn't feel right. Set clear boundaries and communicate your needs assertively. This emotion helps protect your well-being.",
        "neutral": "A calm, neutral state can be a great foundation for mindfulness and presence. Use this time to check in with yourself - how are you really feeling? Consider gentle activities like meditation or a peaceful walk to maintain this balanced state."
    }
    return advice.get(emotion.lower(), "Every emotion is valid and temporary. Practice self-compassion and remember that seeking support is a sign of strength, not weakness. You're not alone in this journey.")