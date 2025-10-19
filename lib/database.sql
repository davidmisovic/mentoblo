-- Note: auth.users table is managed by Supabase and doesn't need RLS enabled
-- RLS is already enabled on auth.users by default

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  subjects TEXT[],
  hourly_rate DECIMAL(10,2),
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  subjects TEXT[],
  level TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  price DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue')),
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT,
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  subject TEXT,
  level TEXT,
  preferred_time TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  scheduled_time TIMESTAMP WITH TIME ZONE,
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  payment_method TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create availability table
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI reports table
CREATE TABLE IF NOT EXISTS public.ai_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('lesson_plan', 'parent_report', 'progress_assessment')),
  content TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Students policies
CREATE POLICY "Tutors can view own students" ON public.students
  FOR SELECT USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can insert own students" ON public.students
  FOR INSERT WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update own students" ON public.students
  FOR UPDATE USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can delete own students" ON public.students
  FOR DELETE USING (auth.uid() = tutor_id);

-- Lessons policies
CREATE POLICY "Tutors can view own lessons" ON public.lessons
  FOR SELECT USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can insert own lessons" ON public.lessons
  FOR INSERT WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update own lessons" ON public.lessons
  FOR UPDATE USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can delete own lessons" ON public.lessons
  FOR DELETE USING (auth.uid() = tutor_id);

-- Consultations policies
CREATE POLICY "Tutors can view own consultations" ON public.consultations
  FOR SELECT USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can insert own consultations" ON public.consultations
  FOR INSERT WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update own consultations" ON public.consultations
  FOR UPDATE USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can delete own consultations" ON public.consultations
  FOR DELETE USING (auth.uid() = tutor_id);

-- Invoices policies
CREATE POLICY "Tutors can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can insert own invoices" ON public.invoices
  FOR INSERT WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update own invoices" ON public.invoices
  FOR UPDATE USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can delete own invoices" ON public.invoices
  FOR DELETE USING (auth.uid() = tutor_id);

-- Invoice items policies
CREATE POLICY "Tutors can view own invoice items" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.tutor_id = auth.uid()
    )
  );

CREATE POLICY "Tutors can insert own invoice items" ON public.invoice_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.tutor_id = auth.uid()
    )
  );

CREATE POLICY "Tutors can update own invoice items" ON public.invoice_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.tutor_id = auth.uid()
    )
  );

CREATE POLICY "Tutors can delete own invoice items" ON public.invoice_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.tutor_id = auth.uid()
    )
  );

-- Availability policies
CREATE POLICY "Tutors can view own availability" ON public.availability
  FOR SELECT USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can insert own availability" ON public.availability
  FOR INSERT WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update own availability" ON public.availability
  FOR UPDATE USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can delete own availability" ON public.availability
  FOR DELETE USING (auth.uid() = tutor_id);

-- AI reports policies
CREATE POLICY "Tutors can view own AI reports" ON public.ai_reports
  FOR SELECT USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can insert own AI reports" ON public.ai_reports
  FOR INSERT WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update own AI reports" ON public.ai_reports
  FOR UPDATE USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can delete own AI reports" ON public.ai_reports
  FOR DELETE USING (auth.uid() = tutor_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_tutor_id ON public.students(tutor_id);
CREATE INDEX IF NOT EXISTS idx_lessons_tutor_id ON public.lessons(tutor_id);
CREATE INDEX IF NOT EXISTS idx_lessons_student_id ON public.lessons(student_id);
CREATE INDEX IF NOT EXISTS idx_lessons_start_time ON public.lessons(start_time);
CREATE INDEX IF NOT EXISTS idx_consultations_tutor_id ON public.consultations(tutor_id);
CREATE INDEX IF NOT EXISTS idx_invoices_tutor_id ON public.invoices(tutor_id);
CREATE INDEX IF NOT EXISTS idx_invoices_student_id ON public.invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_availability_tutor_id ON public.availability(tutor_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_tutor_id ON public.ai_reports(tutor_id);
