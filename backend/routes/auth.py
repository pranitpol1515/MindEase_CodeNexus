from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import os

SECRET = os.getenv("MINDEASE_SECRET", "MINDEASE_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24 * 7

# bcrypt backend is causing runtime crashes on this Windows env and also has a 72-byte limit.
# pbkdf2_sha256 avoids those issues and is widely supported.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"])

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)

def create_token(payload: dict):
    to_encode = dict(payload)
    exp = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": exp})
    return jwt.encode(to_encode, SECRET, algorithm=ALGORITHM)


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, SECRET, algorithms=[ALGORITHM])
    except JWTError:
        return None