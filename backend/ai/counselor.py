def counselor_advice(emotion):

    advice = {
        "sad":"Try meditation or talk with someone you trust.",
        "angry":"Take deep breaths and relax your mind.",
        "happy":"Keep spreading positivity!",
        "fear":"Practice calm breathing exercises."
    }

    return advice.get(emotion,"Stay calm and take care of yourself.")