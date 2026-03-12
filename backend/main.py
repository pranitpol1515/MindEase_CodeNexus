from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend folder so API key is found when run from any directory
_env_file = Path(__file__).resolve().parent / ".env"
load_dotenv(_env_file)

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from database.database import users_collection, admins_collection, counselors_collection, appointments_collection
from models.user import User, LoginUser, SignupUser
from routes.chat import router as chat_router
from routes.mood import router as mood_router
from routes.admin import router as admin_router
from routes.schedule import router as schedule_router
from routes.journal import router as journal_router
from database.database import counselor_applications_collection
from routes.auth import create_token, decode_token, hash_password, verify_password

app = FastAPI()


@app.on_event("startup")
def seed_admin():
    """Create default admin if none exists: username=admin, password=admin123"""
    if admins_collection.find_one({"username": "admin"}) is None:
        admins_collection.insert_one({
            "username": "admin",
            "email": "admin@mindease.app",
            "password": hash_password("admin123"),
        })
security = HTTPBearer(auto_error=False)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router)
app.include_router(mood_router)
app.include_router(admin_router)
app.include_router(schedule_router)
app.include_router(journal_router)


def _profile_from_user(doc):
    """Build profile dict for frontend (no password)."""
    if not doc:
        return None
    return {
        "username": doc.get("username"),
        "email": doc.get("email"),
        "age_group": doc.get("age_group", "above_18"),
        "birthdate": doc.get("birthdate", ""),
        "language": doc.get("language", "en"),
    }


@app.get("/")
def home():
    return {"message": "MindEase API running"}


@app.get("/counselors")
def list_counselors():
    """List approved counselors for book appointment."""
    counselors = []
    for c in counselors_collection.find({}, {"password": 0}):
        counselors.append({
            "id": str(c["_id"]),
            "name": c.get("name", ""),
            "email": c.get("email", ""),
            "qualification": c.get("qualification", ""),
            "license_number": c.get("license_number", ""),
            "city": c.get("city", ""),
            "phone": c.get("phone", ""),
        })
    return counselors


@app.get("/counselors/{counselor_id}")
def get_counselor(counselor_id: str):
    """Get single counselor for profile/booking."""
    from bson import ObjectId
    try:
        c = counselors_collection.find_one({"_id": ObjectId(counselor_id)}, {"password": 0})
    except Exception:
        raise HTTPException(status_code=404, detail="Counselor not found")
    if not c:
        raise HTTPException(status_code=404, detail="Counselor not found")
    return {
        "id": str(c["_id"]),
        "name": c.get("name", ""),
        "email": c.get("email", ""),
        "qualification": c.get("qualification", ""),
        "license_number": c.get("license_number", ""),
        "city": c.get("city", ""),
        "phone": c.get("phone", ""),
    }


class AppointmentBody(BaseModel):
    counselor_id: str
    user_name: str | None = None
    age_group: str | None = None
    date: str
    time: str
    mobile_no: str
    parent_mobile_no: str | None = None


@app.post("/appointments")
def create_appointment(body: AppointmentBody):
    from bson import ObjectId
    appointments_collection.insert_one({
        "counselor_id": body.counselor_id,
        "user_name": body.user_name,
        "age_group": body.age_group,
        "date": body.date,
        "time": body.time,
        "mobile_no": body.mobile_no,
        "parent_mobile_no": body.parent_mobile_no,
    })
    return {"message": "Appointment booked"}


@app.get("/appointments")
def get_appointments(counselor_id: str, date: str):
    apts = []
    for a in appointments_collection.find({"counselor_id": counselor_id, "date": date}):
        apts.append({
            "id": str(a["_id"]),
            "user_name": a.get("user_name"),
            "age_group": a.get("age_group"),
            "mobile_no": a.get("mobile_no"),
            "parent_mobile_no": a.get("parent_mobile_no"),
            "date": a.get("date"),
            "time": a.get("time"),
        })
    return apts


@app.post("/signup")
def signup(user: User):
    users_collection.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password),
        "age_group": "above_18",
        "birthdate": "",
        "language": "en",
    })
    token = create_token(user.username)
    return {"message": "User created", "token": token}


@app.post("/auth/user/signup")
def auth_user_signup(body: SignupUser):
    existing = users_collection.find_one({"username": body.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    users_collection.insert_one({
        "username": body.username,
        "email": body.email,
        "password": hash_password(body.password),
        "age_group": body.age_group,
        "birthdate": body.birthdate,
        "language": body.language,
    })
    token = create_token(body.username)
    profile = _profile_from_user(users_collection.find_one({"username": body.username}))
    return {"message": "User created", "token": token, "profile": profile}


@app.post("/auth/user/login")
def auth_user_login(user: LoginUser):
    db_user = users_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_token(user.username)
    profile = _profile_from_user(db_user)
    return {"message": "success", "token": token, "profile": profile}


@app.get("/auth/me")
def auth_me(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing token")
    username = decode_token(credentials.credentials)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    db_user = users_collection.find_one({"username": username})
    if db_user:
        out = _profile_from_user(db_user)
        out["role"] = "user"
        return out
    admin = admins_collection.find_one({"username": username})
    if admin:
        return {"username": admin["username"], "email": admin.get("email", ""), "role": "admin"}
    counselor = counselors_collection.find_one({"username": username})
    if counselor:
        return {"username": counselor["username"], "name": counselor.get("name", ""), "email": counselor.get("email", ""), "qualification": counselor.get("qualification", ""), "license_number": counselor.get("license_number", ""), "role": "counselor", "id": str(counselor["_id"])}
    raise HTTPException(status_code=401, detail="User not found")


class CounselorApplyBody(BaseModel):
    name: str
    email: str
    qualification: str
    license_number: str
    city: str = ""
    phone: str = ""
    password: str


class CounselorLoginBody(BaseModel):
    email: str
    password: str


@app.post("/auth/counselor/login")
def counselor_login(body: CounselorLoginBody):
    counselor = counselors_collection.find_one({"email": body.email})
    if not counselor:
        raise HTTPException(status_code=401, detail="Invalid credentials or not yet approved")
    # Password may be in counselor doc (new approvals) or in original application
    pwd = counselor.get("password")
    if not pwd:
        app = counselor_applications_collection.find_one({"email": body.email, "status": "approved"})
        pwd = app.get("password") if app else None
    if not pwd or not verify_password(body.password, pwd):
        raise HTTPException(status_code=401, detail="Invalid credentials or not yet approved")
    token = create_token(counselor["username"])
    profile = {"username": counselor["username"], "name": counselor.get("name", ""), "email": counselor.get("email", "")}
    return {"message": "success", "token": token, "profile": profile}


@app.post("/auth/counselor/apply")
def counselor_apply(body: CounselorApplyBody):
    import re
    username = re.sub(r"[^a-zA-Z0-9]", "", body.name.lower())[:20] or "counselor"
    if counselor_applications_collection.find_one({"email": body.email}):
        raise HTTPException(status_code=400, detail="Application already submitted for this email")
    counselor_applications_collection.insert_one({
        "username": username,
        "name": body.name,
        "email": body.email,
        "qualification": body.qualification,
        "license_number": body.license_number,
        "city": body.city,
        "phone": body.phone,
        "password": hash_password(body.password),
        "status": "pending",
    })
    return {"message": "Application submitted"}


@app.post("/auth/admin/login")
def admin_login(user: LoginUser):
    admin = admins_collection.find_one({"username": user.username})
    if not admin or not verify_password(user.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    token = create_token(user.username)
    profile = {"username": admin["username"], "email": admin.get("email", "")}
    return {"message": "success", "token": token, "profile": profile}


@app.post("/login")
def login(user: LoginUser):
    db_user = users_collection.find_one({"username": user.username})
    if db_user and verify_password(user.password, db_user["password"]):
        token = create_token(user.username)
        return {"message": "success", "token": token}
    return {"message": "invalid"}


# support running the app directly with `python main.py`
# this is handy when you close and reopen the project
if __name__ == "__main__":
    import uvicorn
    import os
    # Use PORT env var if 8000 is blocked (common on Windows - WinError 10013)
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)