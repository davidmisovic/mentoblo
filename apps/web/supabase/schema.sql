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
  user_role TEXT NOT NULL DEFAULT 'student',
  
  -- Tutor-specific fields
  headline TEXT,
  bio TEXT,
  
  -- Stripe Connect fields
  stripe_connect_id TEXT UNIQUE,
  stripe_onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  hourly_rate_cents INT -- Storing currency in cents to avoid floating point issues
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

-- TutorAvailability Table: Stores the recurring weekly availability for each tutor
CREATE TABLE public.tutor_availability (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- A tutor cannot have overlapping time slots on the same day
  CONSTRAINT unique_availability_slot UNIQUE(tutor_id, day_of_week, start_time, end_time)
);

-- RLS Policies for TutorAvailability
ALTER TABLE public.tutor_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Availability is public and viewable by everyone."
  ON public.tutor_availability FOR SELECT
  USING ( true );

CREATE POLICY "Tutors can manage their own availability."
  ON public.tutor_availability FOR ALL
  USING ( auth.uid() = tutor_id );

-- Bookings Table: Stores all confirmed appointments
CREATE TABLE public.bookings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- If booked by a registered user
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- If booked by a guest
  guest_name TEXT,
  guest_email TEXT,

  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,

  -- Booking status: 'confirmed', 'completed', 'cancelled'
  status TEXT NOT NULL DEFAULT 'confirmed',
  
  -- Payment status: 'unpaid', 'processing', 'paid'
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  
  -- Stripe invoice tracking
  stripe_invoice_id TEXT UNIQUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT check_guest_details CHECK (student_id IS NOT NULL OR (guest_name IS NOT NULL AND guest_email IS NOT NULL))
);

-- RLS Policies for Bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can view their own bookings."
  ON public.bookings FOR SELECT
  USING ( auth.uid() = tutor_id );

CREATE POLICY "Public can create bookings (for now)."
  ON public.bookings FOR INSERT
  WITH CHECK ( true ); -- We will tighten this later

-- Payments Table: Tracks all payment transactions
CREATE TABLE public.payments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  booking_id BIGINT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Stripe payment details
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_charge_id TEXT,
  
  -- Payment amounts (in cents)
  amount_cents INT NOT NULL,
  platform_fee_cents INT NOT NULL, -- Our platform fee
  tutor_earnings_cents INT NOT NULL, -- What the tutor receives
  
  -- Payment status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can view their own payments."
  ON public.payments FOR SELECT
  USING ( auth.uid() = tutor_id );

CREATE POLICY "Students can view their own payments."
  ON public.payments FOR SELECT
  USING ( auth.uid() = student_id );

-- Invoices Table: For tracking billing and invoicing
CREATE TABLE public.invoices (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_id BIGINT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  
  -- Invoice details
  invoice_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  
  -- Amounts (in cents)
  subtotal_cents INT NOT NULL,
  tax_cents INT DEFAULT 0,
  total_cents INT NOT NULL,
  
  -- Dates
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for Invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can view their own invoices."
  ON public.invoices FOR SELECT
  USING ( auth.uid() = tutor_id );

CREATE POLICY "Students can view invoices for their bookings."
  ON public.invoices FOR SELECT
  USING ( auth.uid() = student_id );

-- Function to update updated_at timestamp for payments and invoices
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER on_payments_updated
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_invoices_updated
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Lesson Plans Table: AI-generated lesson plans for tutors
CREATE TABLE public.lesson_plans (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  student_level TEXT,
  objectives TEXT,
  generated_plan_markdown TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for Lesson Plans
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can manage their own lesson plans."
  ON public.lesson_plans FOR ALL
  USING ( auth.uid() = tutor_id );

-- Feedback Reports Table: AI-generated feedback for students/parents
CREATE TABLE public.feedback_reports (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_id BIGINT REFERENCES public.bookings(id) ON DELETE SET NULL,
  
  -- Student information (for guest students)
  student_name TEXT,
  student_email TEXT,
  
  -- Feedback content
  session_topic TEXT NOT NULL,
  student_performance TEXT,
  strengths TEXT,
  areas_for_improvement TEXT,
  recommendations TEXT,
  generated_report_markdown TEXT NOT NULL,
  
  -- Status and sharing
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'shared', 'archived')),
  shared_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for Feedback Reports
ALTER TABLE public.feedback_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can manage their own feedback reports."
  ON public.feedback_reports FOR ALL
  USING ( auth.uid() = tutor_id );

CREATE POLICY "Students can view their own feedback reports."
  ON public.feedback_reports FOR SELECT
  USING ( auth.uid() = student_id );

-- Trigger for feedback reports updated_at
CREATE TRIGGER on_feedback_reports_updated
  BEFORE UPDATE ON public.feedback_reports
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Student Reports Table: Simplified AI-generated reports for students
CREATE TABLE public.student_reports (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_id BIGINT REFERENCES public.bookings(id) ON DELETE SET NULL,
  summary_points TEXT NOT NULL,
  generated_report_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for Student Reports
ALTER TABLE public.student_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can manage their own student reports."
  ON public.student_reports FOR ALL
  USING ( auth.uid() = tutor_id );

-- Shared Materials Table: A library for files tutors can share with students
CREATE TABLE public.shared_materials (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Optional: link a file to a specific student
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  file_name TEXT NOT NULL,
  -- This path will point to the file in Supabase Storage
  storage_path TEXT NOT NULL,
  file_type TEXT,
  file_size_bytes BIGINT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for shared_materials
ALTER TABLE public.shared_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can manage their own materials."
  ON public.shared_materials FOR ALL
  USING ( auth.uid() = tutor_id );
  
CREATE POLICY "Students can view materials shared with them."
  ON public.shared_materials FOR SELECT
  USING ( auth.uid() = student_id );

-- Update bookings table to add session notes
ALTER TABLE public.bookings
ADD COLUMN session_notes_markdown TEXT;
