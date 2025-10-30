"""
Test script to verify Google Gemini API key is configured correctly
"""
import os
from config import settings

print("=" * 60)
print("Google Gemini API Key Configuration Test")
print("=" * 60)

# Check if .env file exists
env_file_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_file_path):
    print("✅ .env file found at:", env_file_path)
else:
    print("❌ .env file NOT found at:", env_file_path)
    print("   Create a .env file in the backend folder")

print()

# Check API key from settings
if settings.GOOGLE_API_KEY:
    key_preview = settings.GOOGLE_API_KEY[:10] + "..." + settings.GOOGLE_API_KEY[-4:]
    print(f"✅ API Key loaded: {key_preview}")
    print(f"   Length: {len(settings.GOOGLE_API_KEY)} characters")
    
    # Validate key format
    if settings.GOOGLE_API_KEY.startswith("AIza"):
        print("✅ API Key format looks correct (starts with 'AIza')")
    else:
        print("⚠️  Warning: API Key doesn't start with 'AIza'")
        print("   Make sure you copied the correct key from Google AI Studio")
else:
    print("❌ API Key NOT loaded!")
    print("   Add GOOGLE_API_KEY=your_key to backend/.env file")

print()

# Test API connection
if settings.GOOGLE_API_KEY:
    print("Testing API connection...")
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Simple test
        response = model.generate_content("Say 'API key is working!' in one sentence.")
        print("✅ API Connection successful!")
        print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ API Connection failed!")
        print(f"   Error: {str(e)}")
        print()
        print("Common issues:")
        print("   1. Invalid API key - get a new one from https://aistudio.google.com/app/apikey")
        print("   2. API key has restrictions - make sure Gemini API is enabled")
        print("   3. Network issue - check your internet connection")

print()
print("=" * 60)
