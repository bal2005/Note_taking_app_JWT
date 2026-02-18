import uvicorn
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import crud
import auth
from database import engine, SessionLocal

print("Starting Backend...")
# Create database tables
models.Base.metadata.create_all(bind=engine)
print("Database tables ensured.")


app = FastAPI()

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    os.getenv("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize DB with a test user if not exists
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    user = crud.get_user(db, "admin")
    if not user:
        crud.create_user(db, schemas.UserCreate(username="admin", password="password123"))
    db.close()

@app.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(
        data={"sub": user.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/notes", response_model=List[schemas.Note])
def read_notes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    notes = crud.get_notes(db, skip=skip, limit=limit)
    return notes

@app.post("/notes", response_model=schemas.Note)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    return crud.create_user_note(db=db, note=note)

@app.get("/notes/{note_id}", response_model=schemas.Note)
def read_note(note_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_note = crud.get_note(db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.put("/notes/{note_id}", response_model=schemas.Note)
def update_note(note_id: int, note: schemas.NoteUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_note = crud.update_note(db, note_id=note_id, note=note)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_note = crud.delete_note(db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

