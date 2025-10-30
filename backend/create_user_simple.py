"""
Simple script to create test user with manual bcrypt hash
"""
import bcrypt
from sqlalchemy import text
from database import engine

def create_test_user_simple():
    """Create test user using direct SQL"""
    
    # Simple password
    password = "test123"
    
    # Hash the password manually
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    hashed_str = hashed.decode('utf-8')
    
    # SQL to insert user
    sql = text("""
        INSERT INTO users (name, email, hashed_password, is_active, created_at, updated_at)
        VALUES (:name, :email, :password, :is_active, NOW(), NOW())
        ON CONFLICT (email) DO NOTHING
        RETURNING id;
    """)
    
    try:
        with engine.connect() as conn:
            result = conn.execute(sql, {
                "name": "Test User",
                "email": "test@example.com",
                "password": hashed_str,
                "is_active": True
            })
            conn.commit()
            
            if result.rowcount > 0:
                print("✅ Test user created successfully!")
            else:
                print("ℹ️  Test user already exists!")
            
            print("\n" + "="*50)
            print("📧 LOGIN CREDENTIALS:")
            print("="*50)
            print("Email:    test@example.com")
            print("Password: test123")
            print("="*50)
            print("\n🌐 Login at: http://localhost:3000")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_test_user_simple()
