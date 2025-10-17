# Mentoblo Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in `apps/web/` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wgosylvewsaccqbjpjwy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnb3N5bHZld3NhY2NxYmpwand5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjg5NDgsImV4cCI6MjA3NjIwNDk0OH0.LMFhiAcL-UOoKfe9lDdYsTscdCTh53AuMPx5_Ke7dpc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnb3N5bHZld3NhY2NxYmpwand5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyODk0OCwiZXhwIjoyMDc2MjA0OTQ4fQ.bfVw0ZBRHkKrK3CjsvLHAJ0AYjNTKcaSSbQmgDk0Y28
```

### 2. Database Setup

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to the SQL Editor
3. Run the schema from `apps/web/supabase/schema.sql`:

```sql
-- Create the profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ,
  full_name TEXT,
  avatar_url TEXT,
  
  -- This will be the public URL part, e.g., tutorflow.ai/t/john-doe
  public_handle TEXT UNIQUE,

  -- Role can be 'tutor' or 'student'
  -- Tutors will fill out more details later.
  user_role TEXT NOT NULL DEFAULT 'student'
);

-- Set up Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Set up Storage for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
  FOR SELECT USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar." ON storage.objects
  FOR INSERT WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can update an avatar." ON storage.objects
  FOR UPDATE USING ( bucket_id = 'avatars' );
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install web app dependencies
cd apps/web
npm install
```

### 4. Run Development Server

```bash
# From root directory
npm run dev

# Or from apps/web directory
cd apps/web
npm run dev
```

Visit http://localhost:3000 to see your application!

## 🏗️ Project Structure

```
mentoblo/
├── apps/
│   └── web/                 # Next.js application
│       ├── src/
│       │   ├── app/         # Next.js App Router
│       │   │   ├── auth/    # Authentication routes
│       │   │   ├── dashboard/ # Protected pages
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── components/  # React components
│       │   │   ├── auth/    # Auth components
│       │   │   └── ui/      # Shadcn/UI components
│       │   ├── lib/         # Utilities
│       │   │   └── supabase/ # Supabase configs
│       │   └── types/       # TypeScript types
│       ├── supabase/        # Database schema
│       └── package.json
├── package.json             # Root package.json
└── .gitignore
```

## 🔧 Configuration

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy automatically on push to main

### Supabase Configuration

- **URL**: https://wgosylvewsaccqbjpjwy.supabase.co
- **Anon Key**: Already configured in environment
- **Service Role Key**: Already configured in environment

## 🎨 Features

- ✅ **Authentication**: Supabase Auth with email/password
- ✅ **Protected Routes**: Middleware-based route protection
- ✅ **Modern UI**: Shadcn/UI components with Tailwind CSS
- ✅ **TypeScript**: Full type safety
- ✅ **Responsive**: Mobile-first design
- ✅ **SSR**: Server-side rendering with Next.js 14

## 🚀 Next Steps

1. **Customize the UI**: Modify components in `src/components/`
2. **Add Features**: Create new pages in `src/app/`
3. **Database**: Add more tables in Supabase
4. **Authentication**: Configure OAuth providers
5. **Deploy**: Push to GitHub for automatic Vercel deployment

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com/)

## 🆘 Support

If you encounter any issues:

1. Check the console for errors
2. Verify environment variables are set correctly
3. Ensure Supabase database schema is applied
4. Check Supabase dashboard for authentication settings

Happy coding! 🎉
