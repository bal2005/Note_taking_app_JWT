from bson import ObjectId
from database import users_collection, notes_collection
from schemas import NoteCreate, UserCreate, NoteUpdate
from auth import get_password_hash

# ── Helper ────────────────────────────────────────────────────

def _serialize_doc(doc: dict) -> dict:
    """Convert MongoDB _id to string id."""
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    if "owner_id" in doc:
        doc["owner_id"] = str(doc["owner_id"])
    return doc

# ── User CRUD ─────────────────────────────────────────────────

def get_user(username: str) -> dict:
    doc = users_collection.find_one({"username": username})
    return _serialize_doc(doc) if doc else None

def create_user(user: UserCreate) -> dict:
    hashed = get_password_hash(user.password)
    doc = {
        "username": user.username,
        "hashed_password": hashed,
        "is_active": True,
    }
    result = users_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc

# ── Notes CRUD ────────────────────────────────────────────────

def get_notes(skip: int = 0, limit: int = 100) -> list:
    docs = notes_collection.find().skip(skip).limit(limit)
    return [_serialize_doc(d) for d in docs]

def create_user_note(note: NoteCreate, owner_id: str = "000000000000000000000001") -> dict:
    doc = {
        "title": note.title,
        "content": note.content,
        "owner_id": owner_id,
    }
    result = notes_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc

def get_note(note_id: str) -> dict:
    if not ObjectId.is_valid(note_id):
        return None
    doc = notes_collection.find_one({"_id": ObjectId(note_id)})
    return _serialize_doc(doc) if doc else None

def delete_note(note_id: str) -> dict:
    if not ObjectId.is_valid(note_id):
        return None
    doc = notes_collection.find_one_and_delete({"_id": ObjectId(note_id)})
    return _serialize_doc(doc) if doc else None

def update_note(note_id: str, note: NoteUpdate) -> dict:
    if not ObjectId.is_valid(note_id):
        return None
    update_fields = {k: v for k, v in note.dict().items() if v is not None}
    if not update_fields:
        return get_note(note_id)
    notes_collection.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": update_fields}
    )
    return get_note(note_id)
