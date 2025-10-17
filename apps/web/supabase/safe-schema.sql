-- Safe Supabase Schema for Mentoblo SaaS Platform
-- This version handles existing tables and won't cause conflicts

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT,
  public_handle TEXT UNIQUE,
  user_role TEXT NOT NULL DEFAULT 'student' CHECK (user_role IN ('tutor', 'student')),
  headline TEXT,
  bio TEXT,
  stripe_connect_id TEXT UNIQUE,
  stripe_onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  hourly_rate_cents INT DEFAULT 5000 -- $50.00 default
);

-- Add columns to profiles if they don't exist
DO $$ 
BEGIN
  -- Add headline column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'headline') THEN
    ALTER TABLE public.profiles ADD COLUMN headline TEXT;
  END IF;
  
  -- Add bio column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
    ALTER TABLE public.profiles ADD COLUMN bio TEXT;
  END IF;
  
  -- Add stripe_connect_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stripe_connect_id') THEN
    ALTER TABLE public.profiles ADD COLUMN stripe_connect_id TEXT UNIQUE;
  END IF;
  
  -- Add stripe_onboarding_complete column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stripe_onboarding_complete') THEN
    ALTER TABLE public.profiles ADD COLUMN stripe_onboarding_complete BOOLEAN NOT NULL DEFAULT false;
  END IF;
  
  -- Add hourly_rate_cents column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'hourly_rate_cents') THEN
    ALTER TABLE public.profiles ADD COLUMN hourly_rate_cents INT DEFAULT 5000;
  END IF;
END $$;

-- Enable RLS on profiles (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

-- Create RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create tutor_availability table
CREATE TABLE IF NOT EXISTS public.tutor_availability (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tutor_id, day_of_week, start_time, end_time)
);

-- Enable RLS on tutor_availability
ALTER TABLE public.tutor_availability ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for tutor_availability
DROP POLICY IF EXISTS "Public can view tutor availability." ON public.tutor_availability;
DROP POLICY IF EXISTS "Tutors can manage their own availability." ON public.tutor_availability;

CREATE POLICY "Public can view tutor availability." 
  ON public.tutor_availability FOR SELECT 
  USING (true);

CREATE POLICY "Tutors can manage their own availability." 
  ON public.tutor_availability FOR ALL 
  USING (auth.uid() = tutor_id);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT,
  guest_email TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'processing', 'paid')),
  stripe_invoice_id TEXT UNIQUE,
  session_notes_markdown TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_guest_details CHECK (
    student_id IS NOT NULL OR (guest_name IS NOT NULL AND guest_email IS NOT NULL)
  )
);

-- Add columns to bookings if they don't exist
DO $$ 
BEGIN
  -- Add payment_status column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_status') THEN
    ALTER TABLE public.bookings ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'processing', 'paid'));
  END IF;
  
  -- Add stripe_invoice_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'stripe_invoice_id') THEN
    ALTER TABLE public.bookings ADD COLUMN stripe_invoice_id TEXT UNIQUE;
  END IF;
  
  -- Add session_notes_markdown column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'session_notes_markdown') THEN
    ALTER TABLE public.bookings ADD COLUMN session_notes_markdown TEXT;
  END IF;
END $$;

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for bookings
DROP POLICY IF EXISTS "Tutors can view their own bookings." ON public.bookings;
DROP POLICY IF EXISTS "Students can view their own bookings." ON public.bookings;
DROP POLICY IF EXISTS "Public can create bookings (for now)." ON public.bookings;
DROP POLICY IF EXISTS "Tutors can update their own bookings." ON public.bookings;
DROP POLICY IF EXISTS "Students can update their own bookings." ON public.bookings;

CREATE POLICY "Tutors can view their own bookings." 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = tutor_id);

CREATE POLICY "Students can view their own bookings." 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Public can create bookings (for now)." 
  ON public.bookings FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Tutors can update their own bookings." 
  ON public.bookings FOR UPDATE 
  USING (auth.uid() = tutor_id);

CREATE POLICY "Students can update their own bookings." 
  ON public.bookings FOR UPDATE 
  USING (auth.uid() = student_id);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  booking_id BIGINT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_charge_id TEXT,
  amount_cents INT NOT NULL,
  platform_fee_cents INT NOT NULL,
  tutor_earnings_cents INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for payments
DROP POLICY IF EXISTS "Tutors can view their own payments." ON public.payments;
DROP POLICY IF EXISTS "Students can view their own payments." ON public.payments;

CREATE POLICY "Tutors can view their own payments." 
  ON public.payments FOR SELECT 
  USING (auth.uid() = tutor_id);

CREATE POLICY "Students can view their own payments." 
  ON public.payments FOR SELECT 
  USING (auth.uid() = student_id);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_id BIGINT REFERENCES public.bookings(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal_cents INT NOT NULL,
  tax_cents INT DEFAULT 0,
  total_cents INT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for invoices
DROP POLICY IF EXISTS "Tutors can view their own invoices." ON public.invoices;
DROP POLICY IF EXISTS "Students can view invoices for their bookings." ON public.invoices;

CREATE POLICY "Tutors can view their own invoices." 
  ON public.invoices FOR SELECT 
  USING (auth.uid() = tutor_id);

CREATE POLICY "Students can view invoices for their bookings." 
  ON public.invoices FOR SELECT 
  USING (auth.uid() = student_id);

-- Create lesson_plans table
CREATE TABLE IF NOT EXISTS public.lesson_plans (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  student_level TEXT NOT NULL,
  objectives TEXT,
  generated_plan_markdown TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on lesson_plans
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for lesson_plans
DROP POLICY IF EXISTS "Tutors can manage their own lesson plans." ON public.lesson_plans;

CREATE POLICY "Tutors can manage their own lesson plans." 
  ON public.lesson_plans FOR ALL 
  USING (auth.uid() = tutor_id);

-- Create feedback_reports table
CREATE TABLE IF NOT EXISTS public.feedback_reports (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_id BIGINT REFERENCES public.bookings(id) ON DELETE SET NULL,
  student_name TEXT,
  student_email TEXT,
  session_topic TEXT NOT NULL,
  student_performance TEXT NOT NULL,
  strengths TEXT,
  areas_for_improvement TEXT,
  recommendations TEXT,
  generated_report_markdown TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'shared', 'archived')),
  shared_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on feedback_reports
ALTER TABLE public.feedback_reports ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for feedback_reports
DROP POLICY IF EXISTS "Tutors can manage their own feedback reports." ON public.feedback_reports;
DROP POLICY IF EXISTS "Students can view their own feedback reports." ON public.feedback_reports;

CREATE POLICY "Tutors can manage their own feedback reports." 
  ON public.feedback_reports FOR ALL 
  USING (auth.uid() = tutor_id);

CREATE POLICY "Students can view their own feedback reports." 
  ON public.feedback_reports FOR SELECT 
  USING (auth.uid() = student_id);

-- Create student_reports table
CREATE TABLE IF NOT EXISTS public.student_reports (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_id BIGINT REFERENCES public.bookings(id) ON DELETE SET NULL,
  summary_points TEXT NOT NULL,
  generated_report_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on student_reports
ALTER TABLE public.student_reports ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for student_reports
DROP POLICY IF EXISTS "Tutors can manage their own student reports." ON public.student_reports;

CREATE POLICY "Tutors can manage their own student reports." 
  ON public.student_reports FOR ALL 
  USING (auth.uid() = tutor_id);

-- Create shared_materials table
CREATE TABLE IF NOT EXISTS public.shared_materials (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_type TEXT,
  file_size_bytes BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on shared_materials
ALTER TABLE public.shared_materials ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for shared_materials
DROP POLICY IF EXISTS "Tutors can manage their own materials." ON public.shared_materials;
DROP POLICY IF EXISTS "Students can view materials shared with them." ON public.shared_materials;

CREATE POLICY "Tutors can manage their own materials." 
  ON public.shared_materials FOR ALL 
  USING (auth.uid() = tutor_id);

CREATE POLICY "Students can view materials shared with them." 
  ON public.shared_materials FOR SELECT 
  USING (auth.uid() = student_id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at (drop first if they exist)
DROP TRIGGER IF EXISTS on_payments_updated ON public.payments;
DROP TRIGGER IF EXISTS on_invoices_updated ON public.invoices;
DROP TRIGGER IF EXISTS on_feedback_reports_updated ON public.feedback_reports;

CREATE TRIGGER on_payments_updated
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_invoices_updated
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_feedback_reports_updated
  BEFORE UPDATE ON public.feedback_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation (drop first if it exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for materials (only if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for materials bucket (drop first if they exist)
DROP POLICY IF EXISTS "Public can view materials" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own materials" ON storage.objects;

CREATE POLICY "Public can view materials" ON storage.objects FOR SELECT USING (bucket_id = 'materials');
CREATE POLICY "Authenticated users can upload materials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'materials' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own materials" ON storage.objects FOR UPDATE USING (bucket_id = 'materials' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own materials" ON storage.objects FOR DELETE USING (bucket_id = 'materials' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_bookings_tutor_id ON public.bookings(tutor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON public.bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_payments_tutor_id ON public.payments(tutor_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_tutor_id ON public.lesson_plans(tutor_id);
CREATE INDEX IF NOT EXISTS idx_feedback_reports_tutor_id ON public.feedback_reports(tutor_id);
CREATE INDEX IF NOT EXISTS idx_feedback_reports_student_id ON public.feedback_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_shared_materials_tutor_id ON public.shared_materials(tutor_id);
CREATE INDEX IF NOT EXISTS idx_shared_materials_student_id ON public.shared_materials(student_id);
