from fastapi import APIRouter

from database.database import playlists_collection


router = APIRouter(tags=["playlists"])


@router.get("/playlists")
def public_playlists():
    """
    Public endpoint so users can read motivation / meditation playlists
    configured by admin. No auth required.
    """
    doc = playlists_collection.find_one({"name": "youtube"})
    if not doc:
        return {"motivation_urls": [], "meditation_urls": []}
    if "playlist_urls" in doc and "motivation_urls" not in doc and "meditation_urls" not in doc:
        return {"motivation_urls": doc.get("playlist_urls", []), "meditation_urls": []}
    return {
        "motivation_urls": doc.get("motivation_urls", []),
        "meditation_urls": doc.get("meditation_urls", []),
    }

