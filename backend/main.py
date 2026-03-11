from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import users_collection
from models.user import User, LoginUser

from routes.chat import router as chat_router
from routes.mood import router as mood_router
from routes.emotion import router as emotion_router
from routes.auth_routes import router as auth_router
from routes.counselors import router as counselors_router
from routes.appointments import router as appointments_router
from routes.admin import router as admin_router
from routes.playlists import router as playlists_router

app = FastAPI()

# CORS (Allow React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(chat_router)
app.include_router(mood_router)
app.include_router(emotion_router)
app.include_router(auth_router)
app.include_router(counselors_router)
app.include_router(appointments_router)
app.include_router(admin_router)
app.include_router(playlists_router)


@app.get("/")
def home():
    return {"message": "MindEase API running"}


@app.post("/signup")
def signup(user: User):
    # Backward-compatible endpoint (legacy frontend)
    users_collection.insert_one(
        {
            "username": user.username,
            "email": user.email,
            "password": user.password,
            "role": "user",
        }
    )
    return {"message": "User created"}


@app.post("/login")
def login(user: LoginUser):
    # Backward-compatible endpoint (legacy frontend)
    db_user = users_collection.find_one({"username": user.username})
    if db_user and db_user.get("password") == user.password:
        return {"message": "success", "token": None}
    return {"message": "invalid"}