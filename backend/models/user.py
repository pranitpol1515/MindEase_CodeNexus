from pydantic import BaseModel, EmailStr
from typing import Literal, Optional


class User(BaseModel):
    username: str
    email: EmailStr
    password: str
    age_group: Optional[Literal["below_18", "above_18"]] = None
    birthdate: Optional[str] = None  # ISO date string from frontend (yyyy-mm-dd)
    language: Optional[Literal["en", "hi", "mr"]] = "en"
    role: Optional[Literal["user", "counselor", "admin"]] = "user"


class LoginUser(BaseModel):
    username: str
    password: str
    role: Optional[Literal["user", "counselor", "admin"]] = "user"


class Mood(BaseModel):
    username: str
    mood: str


class ChatMessage(BaseModel):
    username: str
    message: str


class CounselorApplication(BaseModel):
    name: str
    email: EmailStr
    qualification: str
    license_number: str
    city: Optional[str] = None
    phone: Optional[str] = None
    password: str