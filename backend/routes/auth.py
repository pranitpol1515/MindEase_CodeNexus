import bcrypt
from jose import jwt

SECRET = "MINDEASE_SECRET"

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed):
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except:
        return False

def create_token(username):
    token = jwt.encode({"username": username}, SECRET, algorithm="HS256")
    return token


def decode_token(token: str):
    """Return username from token or None if invalid."""
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return payload.get("username")
    except Exception:
        return None