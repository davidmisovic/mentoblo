-- Mentoblo Database Schema
-- Core tables for tutor-student relationship and progress tracking

-- 1. Extend profiles table (assuming it exists from supabase.auth.users)
-- Add columns to the existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'tutor' CHECK (role IN ('tutor', 'student'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS booking_slug TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_booking_slug ON profiles(booking_slug);

-- 2. Create clients table (tutor-student relationship)
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique tutor-student relationship
    UNIQUE(tutor_id, student_id)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_clients_tutor_id ON clients(tutor_id);
CREATE INDEX IF NOT EXISTS idx_clients_student_id ON clients(student_id);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);

-- 3. Create lesson_logs table (Progress Tracking - our "golden handcuffs")
CREATE TABLE IF NOT EXISTS lesson_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    title TEXT NOT NULL,
    grammar_topics TEXT,
    vocab_list TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_lesson_logs_client_id ON lesson_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_lesson_logs_log_date ON lesson_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_lesson_logs_created_at ON lesson_logs(created_at);

-- 4. Create homework table (Client Communications - another "golden handcuff")
CREATE TABLE IF NOT EXISTS homework (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'submitted', 'completed')),
    student_submission TEXT,
    tutor_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    due_date DATE
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_homework_client_id ON homework(client_id);
CREATE INDEX IF NOT EXISTS idx_homework_status ON homework(status);
CREATE INDEX IF NOT EXISTS idx_homework_due_date ON homework(due_date);
CREATE INDEX IF NOT EXISTS idx_homework_created_at ON homework(created_at);

-- 5. Create bookings table (Public booking page)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_bookings_tutor_id ON bookings(tutor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_student_email ON bookings(student_email);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- 6. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Create triggers for updated_at columns
CREATE TRIGGER update_lesson_logs_updated_at 
    BEFORE UPDATE ON lesson_logs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homework_updated_at 
    BEFORE UPDATE ON homework 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Create RLS (Row Level Security) policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Clients policies
CREATE POLICY "Tutors can view their clients" ON clients
    FOR SELECT USING (tutor_id = auth.uid());

CREATE POLICY "Students can view their tutor relationships" ON clients
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Tutors can create client relationships" ON clients
    FOR INSERT WITH CHECK (tutor_id = auth.uid());

-- Lesson logs policies
CREATE POLICY "Tutors can manage lesson logs for their clients" ON lesson_logs
    FOR ALL USING (
        client_id IN (
            SELECT id FROM clients WHERE tutor_id = auth.uid()
        )
    );

CREATE POLICY "Students can view lesson logs for their sessions" ON lesson_logs
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM clients WHERE student_id = auth.uid()
        )
    );

-- Homework policies
CREATE POLICY "Tutors can manage homework for their clients" ON homework
    FOR ALL USING (
        client_id IN (
            SELECT id FROM clients WHERE tutor_id = auth.uid()
        )
    );

CREATE POLICY "Students can view and update homework assigned to them" ON homework
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM clients WHERE student_id = auth.uid()
        )
    );

CREATE POLICY "Students can update homework submissions" ON homework
    FOR UPDATE USING (
        client_id IN (
            SELECT id FROM clients WHERE student_id = auth.uid()
        )
    );

-- Bookings policies
CREATE POLICY "Tutors can manage their bookings" ON bookings
    FOR ALL USING (tutor_id = auth.uid());

CREATE POLICY "Anyone can view confirmed bookings" ON bookings
    FOR SELECT USING (status = 'confirmed');

-- 9. Create useful views for common queries

-- View for tutor's student list with progress summary
CREATE OR REPLACE VIEW tutor_students_summary AS
SELECT 
    c.id as client_id,
    c.tutor_id,
    s.id as student_id,
    s.full_name as student_name,
    s.avatar_url as student_avatar,
    c.created_at as relationship_start,
    COUNT(ll.id) as total_lessons,
    COUNT(h.id) as total_homework,
    COUNT(CASE WHEN h.status = 'completed' THEN 1 END) as completed_homework,
    MAX(ll.log_date) as last_lesson_date
FROM clients c
JOIN profiles s ON c.student_id = s.id
LEFT JOIN lesson_logs ll ON c.id = ll.client_id
LEFT JOIN homework h ON c.id = h.client_id
GROUP BY c.id, c.tutor_id, s.id, s.full_name, s.avatar_url, c.created_at;

-- View for student's progress dashboard
CREATE OR REPLACE VIEW student_progress_dashboard AS
SELECT 
    c.id as client_id,
    c.tutor_id,
    t.full_name as tutor_name,
    t.avatar_url as tutor_avatar,
    COUNT(ll.id) as total_lessons,
    COUNT(h.id) as total_homework,
    COUNT(CASE WHEN h.status = 'assigned' THEN 1 END) as pending_homework,
    COUNT(CASE WHEN h.status = 'completed' THEN 1 END) as completed_homework,
    MAX(ll.log_date) as last_lesson_date,
    MAX(h.due_date) as next_homework_due
FROM clients c
JOIN profiles t ON c.tutor_id = t.id
LEFT JOIN lesson_logs ll ON c.id = ll.client_id
LEFT JOIN homework h ON c.id = h.client_id
GROUP BY c.id, c.tutor_id, t.full_name, t.avatar_url;

-- 10. Insert sample data for testing (optional)
-- This can be removed in production

-- Sample tutor profile
INSERT INTO profiles (id, role, booking_slug, full_name, avatar_url) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'tutor',
    'jane-doe-tutor',
    'Jane Doe',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
) ON CONFLICT (id) DO NOTHING;

-- Sample student profile
INSERT INTO profiles (id, role, full_name, avatar_url) 
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'student',
    'John Smith',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
) ON CONFLICT (id) DO NOTHING;

-- Sample client relationship
INSERT INTO clients (tutor_id, student_id) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002'
) ON CONFLICT (tutor_id, student_id) DO NOTHING;

-- Sample lesson log
INSERT INTO lesson_logs (client_id, log_date, title, grammar_topics, vocab_list, notes)
SELECT 
    c.id,
    CURRENT_DATE - INTERVAL '3 days',
    'Past Tense Review',
    'Simple Past, Past Continuous, Past Perfect',
    'walked, ran, jumped, was reading, had finished',
    'Great progress on irregular verbs. Need more practice with past perfect.'
FROM clients c
WHERE c.tutor_id = '00000000-0000-0000-0000-000000000001'
LIMIT 1;

-- Sample homework
INSERT INTO homework (client_id, title, instructions, due_date)
SELECT 
    c.id,
    'Practice Past Tense',
    'Write 10 sentences using different past tense forms. Include at least 3 irregular verbs.',
    CURRENT_DATE + INTERVAL '2 days'
FROM clients c
WHERE c.tutor_id = '00000000-0000-0000-0000-000000000001'
LIMIT 1;
