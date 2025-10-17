import { Database } from './database'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export type Profile = Tables<'profiles'>
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type TutorAvailability = Tables<'tutor_availability'>
export type TutorAvailabilityInsert = Database['public']['Tables']['tutor_availability']['Insert']
export type TutorAvailabilityUpdate = Database['public']['Tables']['tutor_availability']['Update']

export type Booking = Tables<'bookings'>
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export type Payment = Tables<'payments'>
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']
export type PaymentUpdate = Database['public']['Tables']['payments']['Update']

export type Invoice = Tables<'invoices'>
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

export type LessonPlan = Tables<'lesson_plans'>
export type LessonPlanInsert = Database['public']['Tables']['lesson_plans']['Insert']
export type LessonPlanUpdate = Database['public']['Tables']['lesson_plans']['Update']

export type FeedbackReport = Tables<'feedback_reports'>
export type FeedbackReportInsert = Database['public']['Tables']['feedback_reports']['Insert']
export type FeedbackReportUpdate = Database['public']['Tables']['feedback_reports']['Update']

export type StudentReport = Tables<'student_reports'>
export type StudentReportInsert = Database['public']['Tables']['student_reports']['Insert']
export type StudentReportUpdate = Database['public']['Tables']['student_reports']['Update']

export type SharedMaterial = Tables<'shared_materials'>
export type SharedMaterialInsert = Database['public']['Tables']['shared_materials']['Insert']
export type SharedMaterialUpdate = Database['public']['Tables']['shared_materials']['Update']

// User role types
export type UserRole = 'tutor' | 'student'

// Extended profile types with role-specific properties
export interface TutorProfile extends Profile {
  user_role: 'tutor'
  // Add tutor-specific fields here in the future
}

export interface StudentProfile extends Profile {
  user_role: 'student'
  // Add student-specific fields here in the future
}

// Booking status types
export type BookingStatus = 'confirmed' | 'completed' | 'cancelled'

// Payment status types for bookings
export type BookingPaymentStatus = 'unpaid' | 'processing' | 'paid'

// Day of week enum
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6 // Sunday = 0, Monday = 1, etc.

// Time slot interface for availability management
export interface TimeSlot {
  start_time: string
  end_time: string
}

// Availability slot with day information
export interface AvailabilitySlot extends TutorAvailability {
  day_name: string
}

// Payment status types
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'cancelled'

// Invoice status types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

// Stripe Connect types
export interface StripeConnectAccount {
  id: string
  charges_enabled: boolean
  payouts_enabled: boolean
  details_submitted: boolean
}

// Financial summary types
export interface FinancialSummary {
  total_earnings: number
  platform_fees: number
  net_earnings: number
  pending_payments: number
  completed_sessions: number
}

// Booking with payment information
export interface BookingWithPayment extends Booking {
  payment?: Payment
  invoice?: Invoice
}

// AI-related types
export type StudentLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export type FeedbackStatus = 'draft' | 'shared' | 'archived'

// AI prompt interfaces
export interface LessonPlanPrompt {
  topic: string
  studentLevel: StudentLevel
  objectives?: string
  duration?: number // in minutes
  ageGroup?: string
  subject?: string
}

export interface FeedbackPrompt {
  sessionTopic: string
  studentPerformance: string
  strengths?: string
  areasForImprovement?: string
  sessionNotes?: string
  studentName?: string
  studentAge?: number
}

// AI response interfaces
export interface AILessonPlan {
  title: string
  objectives: string[]
  materials: string[]
  activities: {
    name: string
    description: string
    duration: number
  }[]
  assessment: string
  homework?: string
  notes?: string
}

export interface AIFeedbackReport {
  summary: string
  strengths: string[]
  areasForImprovement: string[]
  recommendations: string[]
  nextSteps: string[]
  overallProgress: 'excellent' | 'good' | 'needs_improvement'
}
