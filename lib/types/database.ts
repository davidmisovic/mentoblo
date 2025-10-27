// Database types for Mentoblo tutoring platform
// Generated to match the Supabase schema

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'tutor' | 'student'
          booking_slug: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'tutor' | 'student'
          booking_slug?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'tutor' | 'student'
          booking_slug?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          tutor_id: string
          student_id: string
          created_at: string
        }
        Insert: {
          id?: string
          tutor_id: string
          student_id: string
          created_at?: string
        }
        Update: {
          id?: string
          tutor_id?: string
          student_id?: string
          created_at?: string
        }
      }
      lesson_logs: {
        Row: {
          id: string
          client_id: string
          log_date: string
          title: string
          grammar_topics: string | null
          vocab_list: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          log_date: string
          title: string
          grammar_topics?: string | null
          vocab_list?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          log_date?: string
          title?: string
          grammar_topics?: string | null
          vocab_list?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      homework: {
        Row: {
          id: string
          client_id: string
          title: string
          instructions: string
          status: 'assigned' | 'submitted' | 'completed'
          student_submission: string | null
          tutor_feedback: string | null
          created_at: string
          updated_at: string
          due_date: string | null
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          instructions: string
          status?: 'assigned' | 'submitted' | 'completed'
          student_submission?: string | null
          tutor_feedback?: string | null
          created_at?: string
          updated_at?: string
          due_date?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          instructions?: string
          status?: 'assigned' | 'submitted' | 'completed'
          student_submission?: string | null
          tutor_feedback?: string | null
          created_at?: string
          updated_at?: string
          due_date?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          tutor_id: string
          student_name: string
          student_email: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          tutor_id: string
          student_name: string
          student_email: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          tutor_id?: string
          student_name?: string
          student_email?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
          notes?: string | null
        }
      }
    }
    Views: {
      tutor_students_summary: {
        Row: {
          client_id: string
          tutor_id: string
          student_id: string
          student_name: string | null
          student_avatar: string | null
          relationship_start: string
          total_lessons: number
          total_homework: number
          completed_homework: number
          last_lesson_date: string | null
        }
      }
      student_progress_dashboard: {
        Row: {
          client_id: string
          tutor_id: string
          tutor_name: string | null
          tutor_avatar: string | null
          total_lessons: number
          total_homework: number
          pending_homework: number
          completed_homework: number
          last_lesson_date: string | null
          next_homework_due: string | null
        }
      }
    }
    Functions: {
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      user_role: 'tutor' | 'student'
      homework_status: 'assigned' | 'submitted' | 'completed'
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    }
  }
}

// Convenience types for common use cases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type LessonLog = Database['public']['Tables']['lesson_logs']['Row']
export type Homework = Database['public']['Tables']['homework']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']

export type TutorStudentsSummary = Database['public']['Views']['tutor_students_summary']['Row']
export type StudentProgressDashboard = Database['public']['Views']['student_progress_dashboard']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type LessonLogInsert = Database['public']['Tables']['lesson_logs']['Insert']
export type HomeworkInsert = Database['public']['Tables']['homework']['Insert']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type ClientUpdate = Database['public']['Tables']['clients']['Update']
export type LessonLogUpdate = Database['public']['Tables']['lesson_logs']['Update']
export type HomeworkUpdate = Database['public']['Tables']['homework']['Update']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

// Extended types with relationships
export interface ClientWithStudent extends Client {
  student: Profile
}

export interface ClientWithTutor extends Client {
  tutor: Profile
}

export interface LessonLogWithClient extends LessonLog {
  client: Client
}

export interface HomeworkWithClient extends Homework {
  client: Client
}

export interface BookingWithTutor extends Booking {
  tutor: Profile
}

// Dashboard data types
export interface TutorDashboardData {
  students: TutorStudentsSummary[]
  totalStudents: number
  totalLessons: number
  totalHomework: number
  completedHomework: number
}

export interface StudentDashboardData {
  tutor: {
    name: string | null
    avatar: string | null
  }
  progress: StudentProgressDashboard
  recentLessons: LessonLog[]
  pendingHomework: Homework[]
  completedHomework: Homework[]
}

// Form data types
export interface LessonLogFormData {
  title: string
  log_date: string
  grammar_topics?: string
  vocab_list?: string
  notes?: string
}

export interface HomeworkFormData {
  title: string
  instructions: string
  due_date?: string
}

export interface BookingFormData {
  student_name: string
  student_email: string
  start_time: string
  end_time: string
  notes?: string
}
