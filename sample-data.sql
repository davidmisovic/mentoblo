-- Sample data for testing Mentoblo database
-- Run this AFTER you have created some users through the sign-up process
-- Replace the UUIDs below with actual user IDs from your auth.users table

-- First, check what users exist in your auth.users table:
-- SELECT id, email FROM auth.users;

-- Then replace the UUIDs below with real user IDs

-- Example: Create a tutor-student relationship
-- (Replace these UUIDs with actual user IDs from your auth.users table)
/*
INSERT INTO profiles (id, role, booking_slug, full_name, avatar_url) 
VALUES (
    'REPLACE_WITH_ACTUAL_TUTOR_ID',
    'tutor',
    'jane-doe-tutor',
    'Jane Doe',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
) ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    booking_slug = EXCLUDED.booking_slug,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;

INSERT INTO profiles (id, role, full_name, avatar_url) 
VALUES (
    'REPLACE_WITH_ACTUAL_STUDENT_ID',
    'student',
    'John Smith',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
) ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;

-- Create client relationship
INSERT INTO clients (tutor_id, student_id) 
VALUES (
    'REPLACE_WITH_ACTUAL_TUTOR_ID',
    'REPLACE_WITH_ACTUAL_STUDENT_ID'
) ON CONFLICT (tutor_id, student_id) DO NOTHING;

-- Create lesson logs
INSERT INTO lesson_logs (client_id, log_date, title, grammar_topics, vocab_list, notes)
SELECT 
    c.id,
    CURRENT_DATE - INTERVAL '3 days',
    'Past Tense Review',
    'Simple Past, Past Continuous, Past Perfect',
    'walked, ran, jumped, was reading, had finished',
    'Great progress on irregular verbs. Need more practice with past perfect.'
FROM clients c
WHERE c.tutor_id = 'REPLACE_WITH_ACTUAL_TUTOR_ID'
LIMIT 1;

INSERT INTO lesson_logs (client_id, log_date, title, grammar_topics, vocab_list, notes)
SELECT 
    c.id,
    CURRENT_DATE - INTERVAL '1 day',
    'Present Perfect Practice',
    'Present Perfect Simple, Present Perfect Continuous',
    'have been, has gone, have lived, has been working',
    'Excellent understanding of present perfect. Ready for more complex tenses.'
FROM clients c
WHERE c.tutor_id = 'REPLACE_WITH_ACTUAL_TUTOR_ID'
LIMIT 1;

-- Create homework assignments
INSERT INTO homework (client_id, title, instructions, due_date)
SELECT 
    c.id,
    'Practice Past Tense',
    'Write 10 sentences using different past tense forms. Include at least 3 irregular verbs.',
    CURRENT_DATE + INTERVAL '2 days'
FROM clients c
WHERE c.tutor_id = 'REPLACE_WITH_ACTUAL_TUTOR_ID'
LIMIT 1;

INSERT INTO homework (client_id, title, instructions, due_date)
SELECT 
    c.id,
    'Present Perfect Exercise',
    'Complete the following exercises: 1) Write 5 sentences about experiences you have had. 2) Write 5 sentences about things you have been doing recently.',
    CURRENT_DATE + INTERVAL '5 days'
FROM clients c
WHERE c.tutor_id = 'REPLACE_WITH_ACTUAL_TUTOR_ID'
LIMIT 1;

-- Create a booking
INSERT INTO bookings (tutor_id, student_name, student_email, start_time, end_time, status, notes)
VALUES (
    'REPLACE_WITH_ACTUAL_TUTOR_ID',
    'Sarah Johnson',
    'sarah.johnson@email.com',
    CURRENT_TIMESTAMP + INTERVAL '1 day',
    CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '1 hour',
    'confirmed',
    'First lesson - introduction and assessment'
);
*/

-- Instructions for using this file:
-- 1. First, sign up some users through your application
-- 2. Check the auth.users table to get their IDs:
--    SELECT id, email FROM auth.users;
-- 3. Replace the placeholder UUIDs above with the actual user IDs
-- 4. Uncomment the SQL statements
-- 5. Run the file in your Supabase SQL editor
