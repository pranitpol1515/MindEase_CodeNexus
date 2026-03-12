from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["mindease"]

users_collection = db["users"]
mood_collection = db["moods"]
admins_collection = db["admins"]
counselor_applications_collection = db["counselor_applications"]
counselors_collection = db["counselors"]
journal_collection = db["journal"]
communities_collection = db["communities"]
community_messages_collection = db["community_messages"]
community_members_collection = db["community_members"]
playlist_collection = db["playlist"]
appointments_collection = db["appointments"]