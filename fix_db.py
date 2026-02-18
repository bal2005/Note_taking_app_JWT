import sys
import os

# Add backend to path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, 'backend')
sys.path.append(backend_dir)

try:
    import database
    import models
    import crud
    from schemas import UserCreate
    from auth import get_password_hash
    
    db = database.SessionLocal()
    models.Base.metadata.create_all(bind=database.engine)
    
    print("Checking admin user...")
    user = crud.get_user(db, "admin")
    if not user:
        print("Admin user not found, creating...")
        crud.create_user(db, UserCreate(username="admin", password="password123"))
        print("Admin user created successfully.")
    else:
        print(f"Admin user already exists. Username: {user.username}")
        
    db.close()
    print("DONE")
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
