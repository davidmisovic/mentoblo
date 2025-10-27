# Mentoblo Database Setup Guide

## Overview
This guide will help you set up the core database schema for Mentoblo, focusing on the tutor-student relationship and the key features that create product stickiness.

## Core Tables

### 1. **profiles** (Extended from Supabase Auth)
- **Purpose**: User profiles with role-based access
- **Key Fields**: `role` (tutor/student), `booking_slug` (for public booking pages)
- **Relationships**: One-to-many with clients, bookings

### 2. **clients** (Tutor-Student Relationships)
- **Purpose**: Core join table tracking which tutor "owns" which student
- **Key Fields**: `tutor_id`, `student_id`, `created_at`
- **Constraints**: Unique combination of tutor_id + student_id

### 3. **lesson_logs** (Progress Tracking - "Golden Handcuff #1")
- **Purpose**: Complete history of every lesson - your data vault
- **Key Fields**: `client_id`, `log_date`, `title`, `grammar_topics`, `vocab_list`, `notes`
- **Value**: Creates stickiness by storing valuable teaching history

### 4. **homework** (Client Communications - "Golden Handcuff #2")
- **Purpose**: Replace email/WhatsApp chaos with structured communication
- **Key Fields**: `client_id`, `title`, `instructions`, `status`, `student_submission`, `tutor_feedback`
- **Value**: Creates engagement and accountability

### 5. **bookings** (Public Booking System)
- **Purpose**: Handle new reservations from prospective clients
- **Key Fields**: `tutor_id`, `student_name`, `student_email`, `start_time`, `end_time`, `status`

## Setup Instructions

### Step 1: Run the SQL Schema
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Execute the script

### Step 2: Verify Tables Created
Check that these tables exist:
- `profiles` (with new columns)
- `clients`
- `lesson_logs`
- `homework`
- `bookings`

### Step 3: Test Row Level Security (RLS)
The schema includes comprehensive RLS policies:
- **Tutors** can only see their own students and data
- **Students** can only see their own progress and homework
- **Public** can view confirmed bookings

### Step 4: Test the Views
Two helpful views are created:
- `tutor_students_summary`: Overview of all students for a tutor
- `student_progress_dashboard`: Progress overview for a student

## Key Features Enabled

### 1. **Tutor-Student Relationship Management**
```sql
-- Get all students for a tutor
SELECT * FROM tutor_students_summary WHERE tutor_id = 'your-tutor-id';
```

### 2. **Progress Tracking**
```sql
-- Get lesson history for a student
SELECT * FROM lesson_logs 
WHERE client_id IN (
    SELECT id FROM clients WHERE student_id = 'student-id'
);
```

### 3. **Homework Management**
```sql
-- Get pending homework for a student
SELECT * FROM homework 
WHERE client_id IN (
    SELECT id FROM clients WHERE student_id = 'student-id'
) AND status = 'assigned';
```

### 4. **Public Booking Pages**
```sql
-- Get tutor's booking page data
SELECT booking_slug, full_name FROM profiles 
WHERE booking_slug = 'jane-doe-tutor';
```

## Data Flow

### For Tutors:
1. **Profile Setup**: Set `role = 'tutor'` and create `booking_slug`
2. **Student Onboarding**: Create client relationship in `clients` table
3. **Lesson Management**: Log each lesson in `lesson_logs`
4. **Homework Assignment**: Create assignments in `homework` table
5. **Progress Tracking**: Use views to monitor student progress

### For Students:
1. **Profile Setup**: Set `role = 'student'`
2. **View Progress**: Access lesson logs and homework through RLS
3. **Submit Homework**: Update homework records with submissions
4. **Track Progress**: Use student dashboard view

## Security Considerations

### Row Level Security (RLS)
- All tables have RLS enabled
- Policies ensure data isolation between tutors
- Students can only see their own data
- Public booking data is appropriately exposed

### Data Privacy
- Student data is protected by RLS
- Only authorized tutors can access their students' data
- Booking information is limited to confirmed bookings

## Performance Optimizations

### Indexes Created
- Role-based queries on profiles
- Tutor-student relationship lookups
- Date-based queries on lesson logs
- Status-based queries on homework
- Time-based queries on bookings

### Views for Common Queries
- Pre-computed summaries reduce query complexity
- Optimized for dashboard displays
- Efficient data aggregation

## Next Steps

1. **API Integration**: Create API endpoints for each table
2. **Frontend Components**: Build UI for lesson logging and homework
3. **Booking System**: Implement public booking page
4. **Notifications**: Set up alerts for homework deadlines
5. **Analytics**: Add reporting on student progress

## Sample Queries

### Get Tutor Dashboard Data
```sql
SELECT 
    ts.student_name,
    ts.total_lessons,
    ts.completed_homework,
    ts.last_lesson_date
FROM tutor_students_summary ts
WHERE ts.tutor_id = 'your-tutor-id'
ORDER BY ts.last_lesson_date DESC;
```

### Get Student Progress
```sql
SELECT 
    spd.tutor_name,
    spd.total_lessons,
    spd.pending_homework,
    spd.next_homework_due
FROM student_progress_dashboard spd
WHERE spd.client_id IN (
    SELECT id FROM clients WHERE student_id = 'your-student-id'
);
```

This schema provides the foundation for a sticky, valuable tutoring platform that keeps both tutors and students engaged through progress tracking and structured communication.
