"""
Test the documents endpoint directly
"""
from database import SessionLocal
from models import User
from auth import create_access_token

db = SessionLocal()

# Get test user
user = db.query(User).filter(User.email == "test@example.com").first()

if user:
    # Create token
    token = create_access_token(data={"sub": user.email})
    print("Test user found!")
    print(f"User ID: {user.id}")
    print(f"Email: {user.email}")
    print(f"\nGenerated Token:")
    print(token)
    print(f"\nUse this in your API request:")
    print(f"Authorization: Bearer {token}")
    
    # Check documents
    from models import Document
    docs = db.query(Document).filter(Document.user_id == user.id).all()
    print(f"\nDocuments for this user: {len(docs)}")
    for doc in docs:
        print(f"  - {doc.filename} ({doc.status})")
else:
    print("Test user not found!")

db.close()
