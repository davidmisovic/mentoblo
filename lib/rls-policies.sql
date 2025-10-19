-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;

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

