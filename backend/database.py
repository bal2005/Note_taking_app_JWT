import os
from pymongo import MongoClient

MONGO_URL = "mongodb+srv://bala5mohan2005_db_user:2mCnoXSt1IVxJ9ec@clusternotes.mea3g2z.mongodb.net/"
DB_NAME = "notesdb"

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
notes_collection = db["notes"]

# Ensure indexes
users_collection.create_index("username", unique=True)
notes_collection.create_index("owner_id")

print("Connected to:", MONGO_URL)
print("Database name:", DB_NAME)

