"""
Test login functionality
"""
from database import SessionLocal
from models import User
from auth import verify_password, authenticate_user
import bcrypt

db = SessionLocal()

# Get test user
user = db.query(User).filter(User.email == "test@example.com").first()

if user:
    print("✅ User found in database")
    print(f"   Name: {user.name}")
    print(f"   Email: {user.email}")
    print(f"   Active: {user.is_active}")
    print(f"   Hashed Password: {user.hashed_password[:50]}...")
    
    # Test password verification
    test_password = "test123"
    print(f"\n🔑 Testing password: '{test_password}'")
    
    try:
        # Test with bcrypt directly
        is_valid_bcrypt = bcrypt.checkpw(
            test_password.encode('utf-8'), 
            user.hashed_password.encode('utf-8')
        )
        print(f"   Bcrypt check: {is_valid_bcrypt}")
    except Exception as e:
        print(f"   Bcrypt error: {e}")
    
    try:
        # Test with passlib
        is_valid_passlib = verify_password(test_password, user.hashed_password)
        print(f"   Passlib check: {is_valid_passlib}")
    except Exception as e:
        print(f"   Passlib error: {e}")
    
    # Test authenticate_user function
    print("\n🔐 Testing authenticate_user function:")
    authenticated = authenticate_user(db, "test@example.com", test_password)
    if authenticated:
        print(f"   ✅ Authentication successful!")
    else:
        print(f"   ❌ Authentication failed!")
        
else:
    print("❌ User NOT found in database!")
    print("\nCreating new user...")
    
    import bcrypt
    password = "test123"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    new_user = User(
        name="Test User",
        email="test@example.com",
        hashed_password=hashed.decode('utf-8'),
        is_active=True
    )
    db.add(new_user)
    db.commit()
    print("✅ User created!")

db.close()
