// Supabase query utilities for Mentoblo tutoring platform
import { supabase } from './supabase'
import type { 
  Profile, 
  Client, 
  LessonLog, 
  Homework, 
  Booking,
  TutorStudentsSummary,
  StudentProgressDashboard,
  ClientInsert,
  LessonLogInsert,
  HomeworkInsert,
  BookingInsert,
  LessonLogUpdate,
  HomeworkUpdate,
  BookingUpdate
} from './types/database'

// ============================================================================
// PROFILES QUERIES
// ============================================================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating profile:', error)
    throw error
  }
  
  return data
}

export async function getTutorByBookingSlug(bookingSlug: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('booking_slug', bookingSlug)
    .eq('role', 'tutor')
    .single()
  
  if (error) {
    console.error('Error fetching tutor by booking slug:', error)
    return null
  }
  
  return data
}

// ============================================================================
// CLIENTS QUERIES (Tutor-Student Relationships)
// ============================================================================

export async function getTutorStudents(tutorId: string): Promise<TutorStudentsSummary[]> {
  const { data, error } = await supabase
    .from('tutor_students_summary')
    .select('*')
    .eq('tutor_id', tutorId)
    .order('last_lesson_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching tutor students:', error)
    return []
  }
  
  return data
}

export async function getStudentTutors(studentId: string): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      tutor:profiles!clients_tutor_id_fkey(*)
    `)
    .eq('student_id', studentId)
  
  if (error) {
    console.error('Error fetching student tutors:', error)
    return []
  }
  
  return data
}

export async function createClientRelationship(tutorId: string, studentId: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .insert({
      tutor_id: tutorId,
      student_id: studentId
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating client relationship:', error)
    return null
  }
  
  return data
}

export async function getClientRelationship(tutorId: string, studentId: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('tutor_id', tutorId)
    .eq('student_id', studentId)
    .single()
  
  if (error) {
    console.error('Error fetching client relationship:', error)
    return null
  }
  
  return data
}

// ============================================================================
// LESSON LOGS QUERIES (Progress Tracking)
// ============================================================================

export async function getLessonLogs(clientId: string): Promise<LessonLog[]> {
  const { data, error } = await supabase
    .from('lesson_logs')
    .select('*')
    .eq('client_id', clientId)
    .order('log_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching lesson logs:', error)
    return []
  }
  
  return data
}

export async function getRecentLessonLogs(tutorId: string, limit: number = 10): Promise<LessonLog[]> {
  const { data, error } = await supabase
    .from('lesson_logs')
    .select(`
      *,
      client:clients!lesson_logs_client_id_fkey(
        student:profiles!clients_student_id_fkey(*)
      )
    `)
    .in('client_id', 
      supabase
        .from('clients')
        .select('id')
        .eq('tutor_id', tutorId)
    )
    .order('log_date', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching recent lesson logs:', error)
    return []
  }
  
  return data
}

export async function createLessonLog(lessonData: LessonLogInsert): Promise<LessonLog | null> {
  const { data, error } = await supabase
    .from('lesson_logs')
    .insert(lessonData)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating lesson log:', error)
    return null
  }
  
  return data
}

export async function updateLessonLog(logId: string, updates: LessonLogUpdate): Promise<LessonLog | null> {
  const { data, error } = await supabase
    .from('lesson_logs')
    .update(updates)
    .eq('id', logId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating lesson log:', error)
    return null
  }
  
  return data
}

export async function deleteLessonLog(logId: string): Promise<boolean> {
  const { error } = await supabase
    .from('lesson_logs')
    .delete()
    .eq('id', logId)
  
  if (error) {
    console.error('Error deleting lesson log:', error)
    return false
  }
  
  return true
}

// ============================================================================
// HOMEWORK QUERIES (Client Communications)
// ============================================================================

export async function getHomework(clientId: string): Promise<Homework[]> {
  const { data, error } = await supabase
    .from('homework')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching homework:', error)
    return []
  }
  
  return data
}

export async function getPendingHomework(studentId: string): Promise<Homework[]> {
  const { data, error } = await supabase
    .from('homework')
    .select(`
      *,
      client:clients!homework_client_id_fkey(
        tutor:profiles!clients_tutor_id_fkey(*)
      )
    `)
    .in('client_id', 
      supabase
        .from('clients')
        .select('id')
        .eq('student_id', studentId)
    )
    .eq('status', 'assigned')
    .order('due_date', { ascending: true })
  
  if (error) {
    console.error('Error fetching pending homework:', error)
    return []
  }
  
  return data
}

export async function createHomework(homeworkData: HomeworkInsert): Promise<Homework | null> {
  const { data, error } = await supabase
    .from('homework')
    .insert(homeworkData)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating homework:', error)
    return null
  }
  
  return data
}

export async function updateHomework(homeworkId: string, updates: HomeworkUpdate): Promise<Homework | null> {
  const { data, error } = await supabase
    .from('homework')
    .update(updates)
    .eq('id', homeworkId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating homework:', error)
    return null
  }
  
  return data
}

export async function submitHomework(homeworkId: string, submission: string): Promise<Homework | null> {
  return updateHomework(homeworkId, {
    student_submission: submission,
    status: 'submitted'
  })
}

export async function gradeHomework(homeworkId: string, feedback: string): Promise<Homework | null> {
  return updateHomework(homeworkId, {
    tutor_feedback: feedback,
    status: 'completed'
  })
}

// ============================================================================
// BOOKINGS QUERIES (Public Booking System)
// ============================================================================

export async function getTutorBookings(tutorId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('tutor_id', tutorId)
    .order('start_time', { ascending: true })
  
  if (error) {
    console.error('Error fetching tutor bookings:', error)
    return []
  }
  
  return data
}

export async function getUpcomingBookings(tutorId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('tutor_id', tutorId)
    .gte('start_time', new Date().toISOString())
    .in('status', ['confirmed', 'pending'])
    .order('start_time', { ascending: true })
  
  if (error) {
    console.error('Error fetching upcoming bookings:', error)
    return []
  }
  
  return data
}

export async function createBooking(bookingData: BookingInsert): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating booking:', error)
    return null
  }
  
  return data
}

export async function updateBooking(bookingId: string, updates: BookingUpdate): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating booking:', error)
    return null
  }
  
  return data
}

// ============================================================================
// DASHBOARD QUERIES
// ============================================================================

export async function getTutorDashboardData(tutorId: string) {
  const [students, recentLogs, recentHomework] = await Promise.all([
    getTutorStudents(tutorId),
    getRecentLessonLogs(tutorId, 5),
    supabase
      .from('homework')
      .select(`
        *,
        client:clients!homework_client_id_fkey(
          student:profiles!clients_student_id_fkey(*)
        )
      `)
      .in('client_id', 
        supabase
          .from('clients')
          .select('id')
          .eq('tutor_id', tutorId)
      )
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  return {
    students,
    recentLogs,
    recentHomework: recentHomework.data || [],
    totalStudents: students.length,
    totalLessons: students.reduce((sum, s) => sum + s.total_lessons, 0),
    totalHomework: students.reduce((sum, s) => sum + s.total_homework, 0),
    completedHomework: students.reduce((sum, s) => sum + s.completed_homework, 0)
  }
}

export async function getStudentDashboardData(studentId: string) {
  const [tutors, progress] = await Promise.all([
    getStudentTutors(studentId),
    supabase
      .from('student_progress_dashboard')
      .select('*')
      .in('client_id', 
        supabase
          .from('clients')
          .select('id')
          .eq('student_id', studentId)
      )
  ])

  const clientIds = tutors.map(t => t.id)
  
  const [recentLessons, pendingHomework, completedHomework] = await Promise.all([
    supabase
      .from('lesson_logs')
      .select('*')
      .in('client_id', clientIds)
      .order('log_date', { ascending: false })
      .limit(5),
    supabase
      .from('homework')
      .select('*')
      .in('client_id', clientIds)
      .eq('status', 'assigned')
      .order('due_date', { ascending: true }),
    supabase
      .from('homework')
      .select('*')
      .in('client_id', clientIds)
      .eq('status', 'completed')
      .order('updated_at', { ascending: false })
      .limit(5)
  ])

  return {
    tutors,
    progress: progress.data || [],
    recentLessons: recentLessons.data || [],
    pendingHomework: pendingHomework.data || [],
    completedHomework: completedHomework.data || []
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export async function checkTutorStudentRelationship(tutorId: string, studentId: string): Promise<boolean> {
  const relationship = await getClientRelationship(tutorId, studentId)
  return relationship !== null
}

export async function getClientId(tutorId: string, studentId: string): Promise<string | null> {
  const relationship = await getClientRelationship(tutorId, studentId)
  return relationship?.id || null
}
