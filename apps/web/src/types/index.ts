// Type definitions for Mentoblo

export type UserRole = 'tutor' | 'student' | 'admin'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  user_role?: string
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  student_id: string
  tutor_id: string
  title: string
  description?: string
  scheduled_at: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled'
  meeting_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Material {
  id: string
  title: string
  description?: string
  file_url: string
  file_type: string
  file_size: number
  tutor_id: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  student_id: string
  tutor_id: string
  session_id: string
  start_time: string
  end_time: string
  guest_name?: string
  guest_email?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_status: 'pending' | 'paid' | 'refunded' | 'processing' | 'unpaid'
  amount: number
  currency: string
  session_notes_markdown?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  handle: string
  display_name: string
  full_name?: string
  user_role?: string
  public_handle?: string
  bio?: string
  avatar_url?: string
  subjects: string[]
  hourly_rate: number
  hourly_rate_cents?: number
  currency: string
  timezone: string
  is_available: boolean
  stripe_onboarding_complete?: boolean
  created_at: string
  updated_at: string
}

export interface TutorAvailability {
  id: string
  tutor_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
  created_at: string
  updated_at: string
}

export type DayOfWeek = number

export interface TimeSlot {
  start_time: string
  end_time: string
}

export interface TutorAvailabilityInsert {
  tutor_id: string
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
  is_available?: boolean
}

export interface LessonPlan {
  id: string
  tutor_id: string
  title: string
  topic: string
  subject: string
  student_level: string
  duration: number
  objectives: string[]
  activities: string[]
  materials: string[]
  assessment: string
  created_at: string
  updated_at: string
}

export interface FeedbackReport {
  id: string
  session_id: string
  student_id: string
  tutor_id: string
  session_topic: string
  student_name?: string
  status: 'draft' | 'shared' | 'archived'
  content: string
  strengths: string[]
  areas_for_improvement: string[]
  recommendations: string[]
  created_at: string
  updated_at: string
}

export interface FeedbackPrompt {
  session_id?: string
  student_id?: string
  tutor_id?: string
  sessionTopic: string
  studentPerformance: string
  strengths: string
  areasForImprovement: string
  sessionNotes: string
  studentName: string
  studentAge?: number
  tone?: 'professional' | 'friendly' | 'encouraging'
  length?: 'brief' | 'detailed' | 'comprehensive'
}

export type StudentLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type FeedbackStatus = 'draft' | 'shared' | 'archived'

export type BookingPaymentStatus = 'pending' | 'paid' | 'refunded' | 'processing' | 'unpaid'

export interface AILessonPlan {
  title: string
  topic: string
  subject: string
  student_level: string
  duration: number
  objectives: string[]
  activities: string[]
  materials: string[]
  assessment: string
  homework?: string
  notes?: string
}

export interface AIFeedbackReport {
  content: string
  summary?: string
  strengths: string[]
  areas_for_improvement: string[]
  areasForImprovement?: string[]
  recommendations: string[]
}

export interface LessonPlanPrompt {
  subject: string
  topic: string
  studentLevel: StudentLevel
  duration: number
  objectives: string
  ageGroup: string
  prerequisites?: string[]
  materials?: string[]
  assessmentType?: 'formative' | 'summative' | 'diagnostic'
  specialNeeds?: string
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
}

export interface StudentReport {
  id: string
  student_id: string
  tutor_id: string
  session_id: string
  title: string
  content: string
  summary_points?: string
  strengths: string[]
  areas_for_improvement: string[]
  recommendations: string[]
  created_at: string
  updated_at: string
}

export interface SharedMaterial {
  id: string
  tutor_id: string
  student_id?: string
  title: string
  description?: string
  file_url: string
  file_name?: string
  storage_path?: string
  file_type: string
  file_size: number
  file_size_bytes?: number
  is_public: boolean
  created_at: string
  updated_at: string
}