# Database Setup Guide

The database setup has been split into multiple files to avoid permission issues with Supabase. Follow these steps in order:

## Step 1: Create Tables
Run the SQL from `lib/database-setup.sql` in your Supabase SQL Editor.

This creates all the necessary tables:
- profiles
- students  
- lessons
- consultations
- invoices
- invoice_items
- availability
- ai_reports

## Step 2: Set Up Row Level Security
Run the SQL from `lib/rls-policies.sql` in your Supabase SQL Editor.

This enables RLS and creates security policies to ensure users can only access their own data.

## Step 3: Add Triggers and Indexes
Run the SQL from `lib/triggers-and-indexes.sql` in your Supabase SQL Editor.

This creates:
- User profile creation trigger
- Performance indexes

## Alternative: Run All at Once
If you prefer, you can also run the complete `lib/database.sql` file, but make sure to remove or comment out the line:

```sql
-- ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
```

Since this line causes the permission error you encountered.

## Verification
After running all three steps, you should have:
- ✅ All tables created
- ✅ Row Level Security enabled
- ✅ Security policies in place
- ✅ User creation trigger working
- ✅ Performance indexes created

You can verify by checking the tables in your Supabase dashboard under the "Table Editor" section.


