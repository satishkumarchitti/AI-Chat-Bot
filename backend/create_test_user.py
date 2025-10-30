"""
Script to create a test user in the database
"""
import sys
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User
from auth import get_password_hash

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def create_test_user():
    """Create a test user in the database"""
    db = SessionLocal()
    
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.email == "test@example.com").first()
        
        if existing_user:
            print("❌ Test user already exists!")
            print("\n📧 Login Credentials:")
            print("Email: test@example.com")
            print("Password: test123")
            return
        
        # Create new test user with simple password
        simple_password = "test123"
        test_user = User(
            name="Test User",
            email="test@example.com",
            hashed_password=get_password_hash(simple_password),
            is_active=True
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("✅ Test user created successfully!")
        print("\n" + "="*50)
        print("📧 LOGIN CREDENTIALS:")
        print("="*50)
        print(f"Email:    test@example.com")
        print(f"Password: test123")
        print("="*50)
        print("\n🌐 Login at: http://localhost:3000")
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
