"""Admin management routes (auth at /auth/admin/login in main.py)."""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from database.database import (
    admins_collection,
    users_collection,
    counselor_applications_collection,
    counselors_collection,
    playlist_collection,
)
from routes.auth import decode_token

router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBearer(auto_error=False)


def _get_username(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing token")
    username = decode_token(credentials.credentials)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    admin = admins_collection.find_one({"username": username})
    if not admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    return username


@router.get("/applications")
def get_applications(_: str = Depends(_get_username)):
    apps = []
    for a in counselor_applications_collection.find({"status": "pending"}):
        apps.append({
            "id": str(a["_id"]),
            "name": a.get("name", ""),
            "email": a.get("email", ""),
            "qualification": a.get("qualification", ""),
            "license_number": a.get("license_number", ""),
        })
    return apps


@router.post("/applications/{app_id}/approve")
def approve_application(app_id: str, _: str = Depends(_get_username)):
    from bson import ObjectId
    app = counselor_applications_collection.find_one({"_id": ObjectId(app_id)})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    counselors_collection.insert_one({
        "username": app.get("username", ""),
        "name": app.get("name", ""),
        "email": app.get("email", ""),
        "qualification": app.get("qualification", ""),
        "license_number": app.get("license_number", ""),
        "password": app.get("password", ""),
    })
    counselor_applications_collection.update_one(
        {"_id": ObjectId(app_id)}, {"$set": {"status": "approved"}}
    )
    return {"message": "Approved"}


@router.get("/users")
def get_users(_: str = Depends(_get_username)):
    users = []
    for u in users_collection.find({}, {"password": 0}):
        users.append({
            "id": str(u["_id"]),
            "username": u.get("username", ""),
            "email": u.get("email", ""),
            "age_group": u.get("age_group", ""),
            "language": u.get("language", "en"),
        })
    return users


@router.get("/playlist")
def get_playlist(_: str = Depends(_get_username)):
    doc = playlist_collection.find_one({})
    if not doc:
        return {"motivation_urls": [], "meditation_urls": []}
    return {
        "motivation_urls": doc.get("motivation_urls", []),
        "meditation_urls": doc.get("meditation_urls", []),
    }


class PlaylistBody(BaseModel):
    motivation_urls: list[str] = []
    meditation_urls: list[str] = []


@router.put("/playlist")
def update_playlist(
    body: PlaylistBody,
    _: str = Depends(_get_username),
):
    playlist_collection.update_one(
        {},
        {"$set": {
            "motivation_urls": body.motivation_urls,
            "meditation_urls": body.meditation_urls,
        }},
        upsert=True,
    )
    return {"message": "Updated"}
