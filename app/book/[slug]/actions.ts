'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

interface CreateBookingData {
  tutorId: string
  studentName: string
  studentEmail: string
  startTime: string
  endTime: string
}

export async function createBooking(data: CreateBookingData) {
  try {
    // Validate required fields
    if (!data.tutorId || !data.studentName || !data.studentEmail || !data.startTime || !data.endTime) {
      return {
        success: false,
        error: 'Missing required booking information'
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.studentEmail)) {
      return {
        success: false,
        error: 'Invalid email address'
      }
    }

    // Validate dates
    const startDate = new Date(data.startTime)
    const endDate = new Date(data.endTime)
    const now = new Date()

    if (startDate <= now) {
      return {
        success: false,
        error: 'Booking time must be in the future'
      }
    }

    if (endDate <= startDate) {
      return {
        success: false,
        error: 'End time must be after start time'
      }
    }

    // Check if tutor exists
    const { data: tutor, error: tutorError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', data.tutorId)
      .eq('role', 'tutor')
      .single()

    if (tutorError || !tutor) {
      return {
        success: false,
        error: 'Tutor not found'
      }
    }

    // Check for conflicting bookings
    const { data: conflictingBookings, error: conflictError } = await supabase
      .from('bookings')
      .select('id')
      .eq('tutor_id', data.tutorId)
      .eq('status', 'confirmed')
      .or(`and(start_time.lt.${data.endTime},end_time.gt.${data.startTime})`)

    if (conflictError) {
      console.error('Error checking for conflicts:', conflictError)
      return {
        success: false,
        error: 'Failed to check for booking conflicts'
      }
    }

    if (conflictingBookings && conflictingBookings.length > 0) {
      return {
        success: false,
        error: 'This time slot is no longer available'
      }
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        tutor_id: data.tutorId,
        student_name: data.studentName,
        student_email: data.studentEmail,
        start_time: data.startTime,
        end_time: data.endTime,
        status: 'confirmed',
        notes: `Booking created via public booking page for ${tutor.full_name}`
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return {
        success: false,
        error: 'Failed to create booking. Please try again.'
      }
    }

    // TODO: Send confirmation email to student
    // TODO: Send notification to tutor
    // TODO: Add to calendar integration

    return {
      success: true,
      bookingId: booking.id,
      message: 'Booking created successfully'
    }

  } catch (error) {
    console.error('Unexpected error creating booking:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}
