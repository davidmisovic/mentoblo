-- Functions and Triggers
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

-- Trigger for new user creation
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

