"""
Test registration functionality
"""
from database import SessionLocal
from models import User
from auth import get_password_hash
from schemas import UserCreate

db = SessionLocal()

# Test data
test_user = {
    "name": "New Test User",
    "email": "newuser@example.com",
    "password": "password123"
}

print("Testing Registration...")
print(f"Email: {test_user['email']}")
print(f"Password: {test_user['password']}")

# Check if user already exists
existing = db.query(User).filter(User.email == test_user['email']).first()
if existing:
    print(f"\n⚠️  User already exists, deleting first...")
    db.delete(existing)
    db.commit()

# Test password hashing
try:
    hashed_password = get_password_hash(test_user['password'])
    print(f"\n✅ Password hashed successfully")
    print(f"   Hash: {hashed_password[:50]}...")
    
    # Create new user
    new_user = User(
        name=test_user['name'],
        email=test_user['email'],
        hashed_password=hashed_password,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    print(f"\n✅ User created successfully!")
    print(f"   ID: {new_user.id}")
    print(f"   Name: {new_user.name}")
    print(f"   Email: {new_user.email}")
    print(f"   Active: {new_user.is_active}")
    
    # Test login with new user
    from auth import authenticate_user
    authenticated = authenticate_user(db, test_user['email'], test_user['password'])
    
    if authenticated:
        print(f"\n✅ Login test successful!")
    else:
        print(f"\n❌ Login test failed!")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()

db.close()
