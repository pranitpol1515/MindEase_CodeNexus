from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["mindease"]

users_collection = db["users"]
mood_collection = db["moods"]
chat_collection = db["chats"]

# New collections for expanded app features
counselors_collection = db["counselors"]
counselor_applications_collection = db["counselor_applications"]
appointments_collection = db["appointments"]
playlists_collection = db["playlists"]