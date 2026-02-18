import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.database import SessionLocal, engine
from backend import models, crud, auth, schemas

def test_auth():
    db = SessionLocal()
    try:
        # Ensure tables exist and user exists
        models.Base.metadata.create_all(bind=engine)
        user = crud.get_user(db, "admin")
        if not user:
            print("Creating admin user...")
            crud.create_user(db, schemas.UserCreate(username="admin", password="password123"))
            user = crud.get_user(db, "admin")
        
        print(f"User in DB: {user.username}, Hash: {user.hashed_password[:10]}...")
        
        # Test verification
        success = auth.authenticate_user(db, "admin", "password123")
        print(f"Authentication result: {'SUCCESS' if success else 'FAILED'}")
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_auth()
