from fastapi import APIRouter, Header, HTTPException
from typing import Optional
from bson import ObjectId

from database.database import (
    counselor_applications_collection,
    counselors_collection,
    users_collection,
    playlists_collection,
)
from routes.auth import decode_token


router = APIRouter(prefix="/admin", tags=["admin"])


def _require_admin(authorization: Optional[str]):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")
    parts = authorization.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid token")
    payload = decode_token(parts[1])
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")


def _serialize_id(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    doc.pop("password", None)
    return doc


@router.get("/applications")
def list_counselor_applications(authorization: Optional[str] = Header(default=None)):
    _require_admin(authorization)
    apps = counselor_applications_collection.find({"status": "pending"})
    return [_serialize_id(a) for a in apps]


@router.post("/applications/{application_id}/approve")
def approve_application(application_id: str, authorization: Optional[str] = Header(default=None)):
    _require_admin(authorization)
    try:
        oid = ObjectId(application_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid application id")

    app = counselor_applications_collection.find_one({"_id": oid})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if app.get("status") != "pending":
        raise HTTPException(status_code=400, detail="Application already processed")

    counselor_doc = {
        "name": app.get("name"),
        "email": app.get("email"),
        "qualification": app.get("qualification"),
        "license_number": app.get("license_number"),
        "city": app.get("city"),
        "phone": app.get("phone"),
        "password": app.get("password"),  # already hashed
    }
    counselors_collection.insert_one(counselor_doc)
    counselor_applications_collection.update_one({"_id": oid}, {"$set": {"status": "approved"}})

    return {"message": "approved"}


@router.get("/users")
def list_users(authorization: Optional[str] = Header(default=None)):
    _require_admin(authorization)
    users = users_collection.find({}, {"password": 0})
    out = []
    for u in users:
        u = dict(u)
        u["id"] = str(u.pop("_id"))
        out.append(u)
    return out


@router.get("/playlist")
def get_playlist(authorization: Optional[str] = Header(default=None)):
    _require_admin(authorization)
    doc = playlists_collection.find_one({"name": "youtube"})
    if not doc:
        return {"motivation_urls": [], "meditation_urls": []}
    # Backward compatibility: old schema used a single playlist_urls list
    if "playlist_urls" in doc and "motivation_urls" not in doc and "meditation_urls" not in doc:
        return {"motivation_urls": doc.get("playlist_urls", []), "meditation_urls": []}
    return {
        "motivation_urls": doc.get("motivation_urls", []),
        "meditation_urls": doc.get("meditation_urls", []),
    }


@router.put("/playlist")
def update_playlist(payload: dict, authorization: Optional[str] = Header(default=None)):
    _require_admin(authorization)
    motivation = payload.get("motivation_urls", [])
    meditation = payload.get("meditation_urls", [])
    playlists_collection.update_one(
        {"name": "youtube"},
        {
            "$set": {
                "name": "youtube",
                "motivation_urls": motivation,
                "meditation_urls": meditation,
            }
        },
        upsert=True,
    )
    return {"message": "updated"}

