import os
from dotenv import load_dotenv
from supabase import create_client

def seed():
    load_dotenv()
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_KEY')
    print(f"Connecting to: {url}")
    client = create_client(url, key)
    
    roles = [
        {'id': 'father', 'role_name': '父亲', 'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', 'color': '#974125', 'icon': 'user', 'display_order': 1},
        {'id': 'mother', 'role_name': '母亲', 'avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', 'color': '#b02500', 'icon': 'heart', 'display_order': 2},
        {'id': 'brother_older', 'role_name': '哥哥', 'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', 'color': '#47624c', 'icon': 'utensils', 'display_order': 3},
        {'id': 'brother_younger', 'role_name': '弟弟', 'avatar': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop', 'color': '#6e5a00', 'icon': 'party-popper', 'display_order': 4}
    ]
    
    try:
        # Check tables
        print("Checking roles table...")
        res = client.table('roles').select('id').execute()
        print(f"Current roles in DB: {len(res.data)}")
        
        if len(res.data) == 0:
            print("Seeding roles...")
            res_insert = client.table('roles').upsert(roles).execute()
            print(f"Seed roles successful: {len(res_insert.data)} roles added.")
        else:
            print("Roles already exist.")
            
        # Seed a fake session and post
        print("Seeding fake post...")
        session_data = {
            'role_id': 'father',
            'start_time': '2024-03-31T10:00:00Z',
            'status': 'completed',
            'duration_seconds': 3600
        }
        session_res = client.table('usage_sessions').insert(session_data).execute()
        
        if session_res.data:
            session_id = session_res.data[0]['id']
            post_data = {
                'usage_session_id': session_id,
                'role_id': 'father',
                'photo_url': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&fit=crop',
                'caption': '今天爸爸做了好吃的紅燒肉！🍗',
                'published_at': '2024-03-31T11:00:00Z',
                'duration_seconds': 3600
            }
            client.table('usage_posts').insert(post_data).execute()
            print("Successfully added 1 fake post for Father.")
            
    except Exception as e:
        print(f"Error seeding data: {e}")

if __name__ == "__main__":
    seed()
