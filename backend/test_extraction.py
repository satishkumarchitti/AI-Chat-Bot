"""
Test document extraction directly
"""
import os
from ai_service import document_extractor
from config import settings

# Test with a sample text (simulating extracted text)
print("=" * 60)
print("Testing Document Extraction")
print("=" * 60)

# Check if uploads directory exists
upload_dir = settings.UPLOAD_DIR
print(f"\nUpload directory: {upload_dir}")
print(f"Directory exists: {os.path.exists(upload_dir)}")

if os.path.exists(upload_dir):
    files = os.listdir(upload_dir)
    print(f"Files in directory: {len(files)}")
    
    if files:
        print("\nTesting with first file...")
        test_file = files[0]
        file_path = os.path.join(upload_dir, test_file)
        print(f"File: {test_file}")
        print(f"Full path: {file_path}")
        
        # Determine file type
        file_type = "image" if test_file.lower().endswith(('.jpg', '.jpeg', '.png')) else "pdf"
        print(f"File type: {file_type}")
        
        print("\nExtracting data...")
        try:
            result = document_extractor.extract_structured_data(file_path, file_type)
            print("\n✅ Extraction successful!")
            print("\nExtracted data:")
            import json
            print(json.dumps(result, indent=2))
        except Exception as e:
            print(f"\n❌ Extraction failed!")
            print(f"Error: {str(e)}")
            import traceback
            traceback.print_exc()
    else:
        print("\n⚠️  No files found in upload directory")
        print("Upload a document through the web interface first")
else:
    print("\n❌ Upload directory doesn't exist!")
    print(f"Create directory: {upload_dir}")

print("\n" + "=" * 60)
