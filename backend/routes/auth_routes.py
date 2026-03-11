from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
import os

from database.database import (
    users_collection,
    counselors_collection,
    counselor_applications_collection,
)
from models.user import User, LoginUser, CounselorApplication
from routes.auth import hash_password, verify_password, create_token, decode_token


router = APIRouter(prefix="/auth", tags=["auth"])


class AdminLogin(BaseModel):
    username: str
    password: str


class CounselorLogin(BaseModel):
    email: EmailStr
    password: str


def _get_bearer_token(authorization: Optional[str]) -> Optional[str]:
    if not authorization:
        return None
    parts = authorization.split(" ", 1)
    if len(parts) != 2:
        return None
    scheme, token = parts
    if scheme.lower() != "bearer":
        return None
    return token.strip()


@router.post("/user/signup")
def user_signup(user: User):
    existing = users_collection.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    users_collection.insert_one(
        {
            "username": user.username,
            "email": user.email,
            "password": hash_password(user.password),
            "age_group": user.age_group,
            "birthdate": user.birthdate,
            "language": user.language or "en",
            "role": "user",
        }
    )
    return {"message": "User created"}


@router.post("/user/login")
def user_login(user: LoginUser):
    db_user = users_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"username": db_user["username"], "role": "user"})
    return {
        "message": "success",
        "token": token,
        "profile": {
            "username": db_user.get("username"),
            "email": db_user.get("email"),
            "age_group": db_user.get("age_group"),
            "birthdate": db_user.get("birthdate"),
            "language": db_user.get("language", "en"),
            "role": "user",
        },
    }


@router.post("/counselor/apply")
def counselor_apply(app: CounselorApplication):
    existing = counselor_applications_collection.find_one(
        {"$or": [{"email": app.email}, {"license_number": app.license_number}]}
    )
    if existing:
        raise HTTPException(status_code=400, detail="Application already exists")

    counselor_applications_collection.insert_one(
        {
            "name": app.name,
            "email": app.email,
            "qualification": app.qualification,
            "license_number": app.license_number,
            "city": app.city,
            "phone": app.phone,
            "password": hash_password(app.password),
            "status": "pending",
        }
    )
    return {"message": "Application submitted"}


@router.post("/counselor/login")
def counselor_login(data: CounselorLogin):
    counselor = counselors_collection.find_one({"email": data.email})
    if not counselor or not verify_password(data.password, counselor["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"email": counselor["email"], "role": "counselor", "id": str(counselor["_id"])})
    return {
        "message": "success",
        "token": token,
        "profile": {
            "id": str(counselor.get("_id")),
            "name": counselor.get("name"),
            "email": counselor.get("email"),
            "qualification": counselor.get("qualification"),
            "license_number": counselor.get("license_number"),
            "city": counselor.get("city"),
            "phone": counselor.get("phone"),
            "role": "counselor",
        },
    }


@router.post("/admin/login")
def admin_login(data: AdminLogin):
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
    if data.username != admin_username or data.password != admin_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"username": admin_username, "role": "admin"})
    return {"message": "success", "token": token, "profile": {"username": admin_username, "role": "admin"}}


@router.get("/me")
def me(authorization: Optional[str] = Header(default=None)):
    token = _get_bearer_token(authorization)
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")

    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    role = payload.get("role")
    if role == "user":
        db_user = users_collection.find_one({"username": payload.get("username")})
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "role": "user",
            "username": db_user.get("username"),
            "email": db_user.get("email"),
            "age_group": db_user.get("age_group"),
            "birthdate": db_user.get("birthdate"),
            "language": db_user.get("language", "en"),
        }

    if role == "counselor":
        c = counselors_collection.find_one({"email": payload.get("email")})
        if not c:
            raise HTTPException(status_code=404, detail="Counselor not found")
        return {
            "role": "counselor",
            "id": str(c.get("_id")),
            "name": c.get("name"),
            "email": c.get("email"),
            "qualification": c.get("qualification"),
            "license_number": c.get("license_number"),
        }

    if role == "admin":
        return {"role": "admin", "username": payload.get("username")}

    raise HTTPException(status_code=401, detail="Invalid token")

