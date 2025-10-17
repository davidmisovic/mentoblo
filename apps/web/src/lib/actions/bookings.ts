'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { BookingStatus, BookingPaymentStatus } from '@/types'

export async function updateBookingStatus(
  bookingId: number, 
  status: BookingStatus
) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Verify the user is the tutor for this booking
  const { data: booking } = await supabase
    .from('bookings')
    .select('tutor_id')
    .eq('id', bookingId)
    .single()

  if (!booking || booking.tutor_id !== user.id) {
    throw new Error('Unauthorized to update this booking')
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  if (error) {
    throw new Error('Failed to update booking status')
  }

  revalidatePath('/tutor/dashboard')
  return { success: true }
}

export async function updateBookingPaymentStatus(
  bookingId: number, 
  paymentStatus: BookingPaymentStatus,
  stripeInvoiceId?: string
) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Verify the user is the tutor for this booking
  const { data: booking } = await supabase
    .from('bookings')
    .select('tutor_id')
    .eq('id', bookingId)
    .single()

  if (!booking || booking.tutor_id !== user.id) {
    throw new Error('Unauthorized to update this booking')
  }

  const updateData: any = { payment_status: paymentStatus }
  if (stripeInvoiceId) {
    updateData.stripe_invoice_id = stripeInvoiceId
  }

  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)

  if (error) {
    throw new Error('Failed to update booking payment status')
  }

  revalidatePath('/tutor/dashboard')
  return { success: true }
}

export async function markBookingAsCompleted(bookingId: number) {
  return updateBookingStatus(bookingId, 'completed')
}

export async function cancelBooking(bookingId: number) {
  return updateBookingStatus(bookingId, 'cancelled')
}

export async function markPaymentAsProcessing(bookingId: number, stripeInvoiceId: string) {
  return updateBookingPaymentStatus(bookingId, 'processing', stripeInvoiceId)
}

export async function markPaymentAsPaid(bookingId: number) {
  return updateBookingPaymentStatus(bookingId, 'paid')
}
