import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.database import SessionLocal, engine
from backend import models, crud

def check_admin():
    db = SessionLocal()
    try:
        # Ensure tables exist
        models.Base.metadata.create_all(bind=engine)
        
        user = crud.get_user(db, "admin")
        if user:
            print(f"USER_FOUND: {user.username}")
        else:
            print("USER_NOT_FOUND")
            # Create it now to be sure
            from backend.schemas import UserCreate
            crud.create_user(db, UserCreate(username="admin", password="password123"))
            print("USER_CREATED")
    except Exception as e:
        print(f"ERROR: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    check_admin()
