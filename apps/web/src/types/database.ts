export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          public_handle: string | null
          user_role: string
          headline: string | null
          bio: string | null
          stripe_connect_id: string | null
          stripe_onboarding_complete: boolean
          hourly_rate_cents: number | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          public_handle?: string | null
          user_role?: string
          headline?: string | null
          bio?: string | null
          stripe_connect_id?: string | null
          stripe_onboarding_complete?: boolean
          hourly_rate_cents?: number | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          public_handle?: string | null
          user_role?: string
          headline?: string | null
          bio?: string | null
          stripe_connect_id?: string | null
          stripe_onboarding_complete?: boolean
          hourly_rate_cents?: number | null
        }
        Relationships: []
      }
      tutor_availability: {
        Row: {
          id: number
          tutor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: number
          tutor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: number
          tutor_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_availability_tutor_id_fkey"
            columns: ["tutor_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: number
          tutor_id: string
          student_id: string | null
          guest_name: string | null
          guest_email: string | null
          start_time: string
          end_time: string
          status: string
          payment_status: string
          stripe_invoice_id: string | null
          session_notes_markdown: string | null
          created_at: string
        }
        Insert: {
          id?: number
          tutor_id: string
          student_id?: string | null
          guest_name?: string | null
          guest_email?: string | null
          start_time: string
          end_time: string
          status?: string
          payment_status?: string
          stripe_invoice_id?: string | null
          session_notes_markdown?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          tutor_id?: string
          student_id?: string | null
          guest_name?: string | null
          guest_email?: string | null
          start_time?: string
          end_time?: string
          status?: string
          payment_status?: string
          stripe_invoice_id?: string | null
          session_notes_markdown?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tutor_id_fkey"
            columns: ["tutor_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: number
          booking_id: number
          tutor_id: string
          student_id: string | null
          stripe_payment_intent_id: string
          stripe_charge_id: string | null
          amount_cents: number
          platform_fee_cents: number
          tutor_earnings_cents: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          booking_id: number
          tutor_id: string
          student_id?: string | null
          stripe_payment_intent_id: string
          stripe_charge_id?: string | null
          amount_cents: number
          platform_fee_cents: number
          tutor_earnings_cents: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          booking_id?: number
          tutor_id?: string
          student_id?: string | null
          stripe_payment_intent_id?: string
          stripe_charge_id?: string | null
          amount_cents?: number
          platform_fee_cents?: number
          tutor_earnings_cents?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tutor_id_fkey"
            columns: ["tutor_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          id: number
          tutor_id: string
          student_id: string | null
          booking_id: number
          invoice_number: string
          status: string
          subtotal_cents: number
          tax_cents: number
          total_cents: number
          issue_date: string
          due_date: string
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          tutor_id: string
          student_id?: string | null
          booking_id: number
          invoice_number: string
          status?: string
          subtotal_cents: number
          tax_cents?: number
          total_cents: number
          issue_date: string
          due_date: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          tutor_id?: string
          student_id?: string | null
          booking_id?: number
          invoice_number?: string
          status?: string
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          issue_date?: string
          due_date?: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_tutor_id_fkey"
            columns: ["tutor_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      }
      lesson_plans: {
        Row: {
          id: number
          tutor_id: string
          topic: string
          student_level: string | null
          objectives: string | null
          generated_plan_markdown: string
          created_at: string
        }
        Insert: {
          id?: number
          tutor_id: string
          topic: string
          student_level?: string | null
          objectives?: string | null
          generated_plan_markdown: string
          created_at?: string
        }
        Update: {
          id?: number
          tutor_id?: string
          topic?: string
          student_level?: string | null
          objectives?: string | null
          generated_plan_markdown?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_plans_tutor_id_fkey"
            columns: ["tutor_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback_reports: {
        Row: {
          id: number
          tutor_id: string
          student_id: string | null
          booking_id: number | null
          student_name: string | null
          student_email: string | null
          session_topic: string
          student_performance: string | null
          strengths: string | null
          areas_for_improvement: string | null
          recommendations: string | null
          generated_report_markdown: string
          status: string
          shared_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          tutor_id: string
          student_id?: string | null
          booking_id?: number | null
          student_name?: string | null
          student_email?: string | null
          session_topic: string
          student_performance?: string | null
          strengths?: string | null
          areas_for_improvement?: string | null
          recommendations?: string | null
          generated_report_markdown: string
          status?: string
          shared_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          tutor_id?: string
          student_id?: string | null
          booking_id?: number | null
          student_name?: string | null
          student_email?: string | null
          session_topic?: string
          student_performance?: string | null
          strengths?: string | null
          areas_for_improvement?: string | null
          recommendations?: string | null
          generated_report_markdown?: string
          status?: string
          shared_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_reports_tutor_id_fkey"
            columns: ["tutor_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_reports_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_reports_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      }
      student_reports: {
        Row: {
          id: number
          tutor_id: string
          student_id: string | null
          booking_id: number | null
          summary_points: string
          generated_report_text: string
          created_at: string
        }
        Insert: {
          id?: number
          tutor_id: string
          student_id?: string | null
          booking_id?: number | null
          summary_points: string
          generated_report_text: string
          created_at?: string
        }
        Update: {
          id?: number
          tutor_id?: string
          student_id?: string | null
          booking_id?: number | null
          summary_points?: string
          generated_report_text?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_reports_tutor_id_fkey"
            columns: ["tutor_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_reports_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_reports_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      }
      shared_materials: {
        Row: {
          id: number
          tutor_id: string
          student_id: string | null
          file_name: string
          storage_path: string
          file_type: string | null
          file_size_bytes: number | null
          created_at: string
        }
        Insert: {
          id?: number
          tutor_id: string
          student_id?: string | null
          file_name: string
          storage_path: string
          file_type?: string | null
          file_size_bytes?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          tutor_id?: string
          student_id?: string | null
          file_name?: string
          storage_path?: string
          file_type?: string | null
          file_size_bytes?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_materials_tutor_id_fkey"
            columns: ["tutor_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_materials_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
