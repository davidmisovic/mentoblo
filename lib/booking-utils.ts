// Utility functions for booking page functionality

/**
 * Generate a URL-friendly slug from a name
 */
export function generateBookingSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

/**
 * Validate a booking slug
 */
export function isValidBookingSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]+$/
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50
}

/**
 * Generate booking URL for a tutor
 */
export function getBookingUrl(slug: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${base}/book/${slug}`
}

/**
 * Format time for display
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

/**
 * Format date for display
 */
export function formatBookingDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Check if a date is available for booking
 */
export function isDateAvailable(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date >= today
}

/**
 * Generate time slots for a given date
 */
export function generateTimeSlots(startHour: number = 9, endHour: number = 18): string[] {
  const slots: string[] = []
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
  }
  return slots
}

/**
 * Validate booking time slot
 */
export function isValidTimeSlot(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

/**
 * Calculate booking duration in minutes
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  
  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute
  
  return endMinutes - startMinutes
}

/**
 * Check if two time slots overlap
 */
export function timeSlotsOverlap(
  start1: string, end1: string,
  start2: string, end2: string
): boolean {
  const [start1Hour, start1Minute] = start1.split(':').map(Number)
  const [end1Hour, end1Minute] = end1.split(':').map(Number)
  const [start2Hour, start2Minute] = start2.split(':').map(Number)
  const [end2Hour, end2Minute] = end2.split(':').map(Number)
  
  const start1Minutes = start1Hour * 60 + start1Minute
  const end1Minutes = end1Hour * 60 + end1Minute
  const start2Minutes = start2Hour * 60 + start2Minute
  const end2Minutes = end2Hour * 60 + end2Minute
  
  return start1Minutes < end2Minutes && start2Minutes < end1Minutes
}
