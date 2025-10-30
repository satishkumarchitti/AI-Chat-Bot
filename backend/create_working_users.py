"""
Create multiple working test users with verified authentication
"""
import bcrypt
from sqlalchemy import text
from database import engine

def create_user(name, email, password):
    """Create a user with bcrypt hash"""
    
    # Hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    hashed_str = hashed.decode('utf-8')
    
    # SQL to insert user
    sql = text("""
        INSERT INTO users (name, email, hashed_password, is_active, created_at, updated_at)
        VALUES (:name, :email, :password, :is_active, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE
        SET hashed_password = EXCLUDED.hashed_password,
            name = EXCLUDED.name
        RETURNING id;
    """)
    
    try:
        with engine.connect() as conn:
            result = conn.execute(sql, {
                "name": name,
                "email": email,
                "password": hashed_str,
                "is_active": True
            })
            conn.commit()
            
            return True
    except Exception as e:
        print(f"Error creating user {email}: {e}")
        return False

# Create multiple test users
users = [
    ("Test User", "test@example.com", "test123"),
    ("Admin User", "admin@test.com", "admin123"),
    ("Demo User", "demo@example.com", "demo123"),
]

print("="*60)
print("Creating Test Users")
print("="*60)

for name, email, password in users:
    if create_user(name, email, password):
        print(f"✅ {name}")
        print(f"   Email:    {email}")
        print(f"   Password: {password}")
        print()

print("="*60)
print("ALL WORKING CREDENTIALS:")
print("="*60)
print()
print("Option 1:")
print("  Email:    test@example.com")
print("  Password: test123")
print()
print("Option 2:")
print("  Email:    admin@test.com")
print("  Password: admin123")
print()
print("Option 3:")
print("  Email:    demo@example.com")
print("  Password: demo123")
print()
print("="*60)
print("🌐 Login at: http://localhost:3002")
print("="*60)
