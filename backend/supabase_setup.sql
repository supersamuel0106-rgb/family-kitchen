-- 角色表 (也可以不存 DB，直接代碼写死，但为了扩充性建表)
CREATE TABLE roles (
    id TEXT PRIMARY KEY,
    role_name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    display_order INTEGER NOT NULL
);

-- 插入默认角色
INSERT INTO roles (id, role_name, avatar, color, icon, display_order) VALUES
('father', '父亲', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', '#974125', 'user', 1),
('mother', '母亲', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', '#b02500', 'heart', 2),
('brother_older', '哥哥', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', '#47624c', 'utensils', 3),
('brother_younger', '弟弟', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop', '#6e5a00', 'party-popper', 4);

-- 预约表
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id TEXT REFERENCES roles(id),
    reservation_date TEXT NOT NULL, -- YYYY-MM-DD
    time_slot TEXT NOT NULL, -- morning or afternoon
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 使用会话表
CREATE TABLE usage_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id TEXT REFERENCES roles(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    status TEXT NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 动态贴文表
CREATE TABLE usage_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usage_session_id UUID REFERENCES usage_sessions(id),
    role_id TEXT REFERENCES roles(id),
    photo_url TEXT NOT NULL,
    caption TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_seconds INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立存储桶
INSERT INTO storage.buckets (id, name, public) VALUES ('kitchen_photos', 'kitchen_photos', true);

-- 设置公开访问策略（如果在面板操作更直观，也可以在 Supabase 面板 Storage 设定中开启 Public）
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'kitchen_photos' );

CREATE POLICY "Allow Insert" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'kitchen_photos' );
