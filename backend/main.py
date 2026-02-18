import uvicorn
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from typing import List

import crud
import auth
import schemas

print("Starting Backend with MongoDB...")




app = FastAPI(title="Notes API")

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://note-taking-app-jwt-2.onrender.com",
    os.getenv("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB with a default admin user on startup
@app.on_event("startup")
def startup_event():
    if not crud.get_user("admin"):
        crud.create_user(schemas.UserCreate(username="admin", password="password123"))
        print("Default admin user created.")
    else:
        print("Admin user already exists.")

# ── Auth ──────────────────────────────────────────────────────

@app.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = auth.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

# ── Notes ─────────────────────────────────────────────────────

@app.get("/notes", response_model=List[schemas.Note])
def read_notes(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(auth.get_current_user),
):
    return crud.get_notes(skip=skip, limit=limit)

@app.post("/notes", response_model=schemas.Note)
def create_note(
    note: schemas.NoteCreate,
    current_user: dict = Depends(auth.get_current_user),
):
    return crud.create_user_note(note=note, owner_id=current_user["_id"])

@app.get("/notes/{note_id}", response_model=schemas.Note)
def read_note(
    note_id: str,
    current_user: dict = Depends(auth.get_current_user),
):
    db_note = crud.get_note(note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.put("/notes/{note_id}", response_model=schemas.Note)
def update_note(
    note_id: str,
    note: schemas.NoteUpdate,
    current_user: dict = Depends(auth.get_current_user),
):
    db_note = crud.update_note(note_id, note)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.delete("/notes/{note_id}")
def delete_note(
    note_id: str,
    current_user: dict = Depends(auth.get_current_user),
):
    db_note = crud.delete_note(note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
