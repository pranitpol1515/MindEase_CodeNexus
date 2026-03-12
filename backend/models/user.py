from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str
    password: str

class SignupUser(BaseModel):
    username: str
    email: str
    password: str
    age_group: str = "above_18"
    birthdate: str = ""
    language: str = "en"

class LoginUser(BaseModel):
    username: str
    password: str

class Mood(BaseModel):
    mood:str