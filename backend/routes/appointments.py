from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from bson import ObjectId

from database.database import appointments_collection, counselors_collection


router = APIRouter(tags=["appointments"])


class AppointmentCreate(BaseModel):
    counselor_id: str
    user_name: Optional[str] = None
    age_group: Optional[Literal["below_18", "above_18"]] = None
    date: str
    time: str
    mobile_no: str
    parent_mobile_no: Optional[str] = None


@router.post("/appointments")
def create_appointment(data: AppointmentCreate):
    try:
        oid = ObjectId(data.counselor_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid counselor id")

    counselor = counselors_collection.find_one({"_id": oid})
    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")

    if data.age_group == "below_18" and not data.parent_mobile_no:
        raise HTTPException(status_code=400, detail="Parent mobile number required for below 18")

    # Prevent double booking of the same time slot for this counselor
    existing = appointments_collection.find_one(
        {"counselor_id": data.counselor_id, "date": data.date, "time": data.time}
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="This time slot is already booked. Please select another time.",
        )

    doc = data.model_dump()
    doc["created_at"] = datetime.utcnow()
    appointments_collection.insert_one(doc)

    return {"message": "appointment booked"}


@router.get("/appointments")
def list_appointments(counselor_id: str, date: Optional[str] = None):
    """
    List appointments for a counselor. Optionally filter by date (YYYY-MM-DD).
    """
    try:
        oid = ObjectId(counselor_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid counselor id")

    query: dict = {"counselor_id": counselor_id}
    if date:
        query["date"] = date

    cursor = appointments_collection.find(query).sort([("date", 1), ("time", 1)])
    out = []
    for a in cursor:
        a = dict(a)
        a["id"] = str(a.pop("_id"))
        out.append(a)
    return out

