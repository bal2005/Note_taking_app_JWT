from sqlalchemy.orm import Session
from models import Note, User
from schemas import NoteCreate, UserCreate, NoteUpdate
from auth import get_password_hash

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    fake_hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_notes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Note).offset(skip).limit(limit).all()

def create_user_note(db: Session, note: NoteCreate):
    db_note = Note(**note.dict(), owner_id=1) # Hardcoded user for simplicity for now
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_note(db: Session, note_id: int):
    return db.query(Note).filter(Note.id == note_id).first()

def delete_note(db: Session, note_id: int):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note:
        db.delete(db_note)
        db.commit()
        return db_note
    return None

def update_note(db: Session, note_id: int, note: NoteUpdate):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note:
        if note.title:
            db_note.title = note.title
        if note.content:
            db_note.content = note.content
        db.commit()
        db.refresh(db_note)
    return db_note
