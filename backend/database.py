import os
from pymongo import MongoClient
from dotenv import load_dotenv


load_dotenv()
MONGO_URL = os.getenv("MONGO_URL")
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

