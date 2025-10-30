"""
Test PDF text extraction
"""
import os
from ai_service import document_extractor
from config import settings

print("=" * 60)
print("Testing PDF Text Extraction")
print("=" * 60)

upload_dir = settings.UPLOAD_DIR
files = [f for f in os.listdir(upload_dir) if f.lower().endswith('.pdf')]

if files:
    test_file = files[0]
    file_path = os.path.join(upload_dir, test_file)
    print(f"\nTesting file: {test_file}")
    print(f"Full path: {file_path}")
    
    print("\n1. Extracting raw text from PDF...")
    try:
        raw_text = document_extractor.extract_text_from_pdf(file_path)
        print(f"✅ Text extracted successfully!")
        print(f"Text length: {len(raw_text)} characters")
        print(f"\nFirst 500 characters:")
        print("-" * 60)
        print(raw_text[:500])
        print("-" * 60)
        
        if not raw_text or len(raw_text.strip()) < 10:
            print("\n⚠️  WARNING: PDF text is empty or too short!")
            print("This PDF might be:")
            print("  - Scanned images without OCR")
            print("  - Protected/encrypted")
            print("  - Corrupted")
    except Exception as e:
        print(f"❌ Text extraction failed!")
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
else:
    print("\n⚠️  No PDF files found")
    
# Test with image files
print("\n" + "=" * 60)
print("Testing Image Text Extraction")
print("=" * 60)

image_files = [f for f in os.listdir(upload_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

if image_files:
    test_file = image_files[0]
    file_path = os.path.join(upload_dir, test_file)
    print(f"\nTesting file: {test_file}")
    print(f"Full path: {file_path}")
    
    print("\n2. Extracting text from image using Gemini Vision...")
    try:
        raw_text = document_extractor.extract_text_from_image(file_path)
        print(f"✅ Text extracted successfully!")
        print(f"Text length: {len(raw_text)} characters")
        print(f"\nFirst 500 characters:")
        print("-" * 60)
        print(raw_text[:500])
        print("-" * 60)
    except Exception as e:
        print(f"❌ Text extraction failed!")
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
else:
    print("\n⚠️  No image files found")

print("\n" + "=" * 60)
