import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

load_dotenv('backend/.env')

from app.repository.supabase_repo import repo
from app.service.kitchen_service import kitchen_service

def test_supabase_connection():
    print("Testing Supabase connection...")
    try:
        roles = repo.get_roles()
        print(f"Successfully fetched {len(roles)} roles.")
        for r in roles:
            print(f"- {r['role_name']} (ID: {r['id']})")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_photo_upload():
    print("\nTesting Photo Upload...")
    try:
        # Create a dummy image
        test_file = "test_upload.jpg"
        with open(test_file, "wb") as f:
            f.write(b"dummy image data")
        
        with open(test_file, "rb") as f:
            file_bytes = f.read()
            
        print("Uploading to Supabase Storage...")
        url = repo.upload_photo(file_bytes, "test_upload.jpg", "image/jpeg")
        print(f"Upload successful! Public URL: {url}")
        
        # Cleanup
        os.remove(test_file)
        return True
    except Exception as e:
        print(f"Error during upload: {e}")
        return False

if __name__ == "__main__":
    if test_supabase_connection():
        test_photo_upload()
    else:
        print("Skipping upload test due to connection failure.")
