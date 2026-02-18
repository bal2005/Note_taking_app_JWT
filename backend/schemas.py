from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId

# Helper to handle MongoDB ObjectId serialization
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


# ── Note Schemas ──────────────────────────────────────────────

class NoteBase(BaseModel):
    title: str
    content: str

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class Note(NoteBase):
    id: str
    owner_id: str

    class Config:
        json_encoders = {ObjectId: str}


# ── User Schemas ──────────────────────────────────────────────

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    is_active: bool
    notes: List[Note] = []

    class Config:
        json_encoders = {ObjectId: str}


# ── Auth Schemas ──────────────────────────────────────────────

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
