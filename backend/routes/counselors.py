from fastapi import APIRouter, HTTPException
from bson import ObjectId

from database.database import counselors_collection, appointments_collection


router = APIRouter(tags=["counselors"])


def _serialize_id(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    doc.pop("password", None)
    return doc


@router.get("/counselors")
def list_counselors():
    counselors = counselors_collection.find({})
    return [_serialize_id(c) for c in counselors]


@router.get("/counselors/{counselor_id}")
def counselor_profile(counselor_id: str):
    try:
        oid = ObjectId(counselor_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid counselor id")

    counselor = counselors_collection.find_one({"_id": oid})
    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")

    data = _serialize_id(counselor)
    data["appointments_count"] = appointments_collection.count_documents({"counselor_id": counselor_id})
    return data

