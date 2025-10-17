'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TutorAvailability, Booking } from '@/types'

interface BookingCalendarProps {
  tutorId: string
  availability: TutorAvailability[]
  existingBookings: Booking[]
}

interface TimeSlot {
  time: string
  available: boolean
}

export function BookingCalendar({ tutorId, availability, existingBookings }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const generateTimeSlots = (date: Date) => {
    const dayOfWeek = date.getDay()
    const dayAvailability = availability.filter(slot => slot.day_of_week === dayOfWeek)
    
    if (dayAvailability.length === 0) {
      setAvailableSlots([])
      return
    }

    const slots: TimeSlot[] = []
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    dayAvailability.forEach(avail => {
      const [startHour, startMinute] = avail.start_time.split(':').map(Number)
      const [endHour, endMinute] = avail.end_time.split(':').map(Number)
      
      const startTime = new Date(date)
      startTime.setHours(startHour, startMinute, 0, 0)
      
      const endTime = new Date(date)
      endTime.setHours(endHour, endMinute, 0, 0)

      // Generate 30-minute slots
      const currentTime = new Date(startTime)
      while (currentTime < endTime) {
        const timeString = currentTime.toTimeString().slice(0, 5)
        const slotEndTime = new Date(currentTime.getTime() + 30 * 60000)
        
        // Check if slot is in the past
        const isPast = isToday && currentTime < now
        
        // Check if slot conflicts with existing bookings
        const hasConflict = existingBookings.some(booking => {
          const bookingStart = new Date(booking.start_time)
          const bookingEnd = new Date(booking.end_time)
          return bookingStart < slotEndTime && bookingEnd > currentTime
        })

        slots.push({
          time: timeString,
          available: !isPast && !hasConflict
        })

        currentTime.setTime(currentTime.getTime() + 30 * 60000)
      }
    })

    setAvailableSlots(slots)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    generateTimeSlots(date)
    setSelectedSlot(null)
  }

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time)
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (!selectedDate || !selectedSlot) {
      setMessage('Please select a date and time slot')
      setLoading(false)
      return
    }

    try {
      const startTime = new Date(selectedDate)
      const [hours, minutes] = selectedSlot.split(':').map(Number)
      startTime.setHours(hours, minutes, 0, 0)
      
      const endTime = new Date(startTime.getTime() + 30 * 60000)

      const { error } = await supabase
        .from('bookings')
        .insert({
          tutor_id: tutorId,
          guest_name: guestName,
          guest_email: guestEmail,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'confirmed',
          payment_status: 'unpaid'
        })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Booking confirmed! You will receive a confirmation email shortly.')
        setGuestName('')
        setGuestEmail('')
        setSelectedSlot(null)
        setShowBookingForm(false)
        // Refresh available slots
        generateTimeSlots(selectedDate)
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select a Date</CardTitle>
          <CardDescription>
            Choose a date to see available time slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date()
              date.setDate(date.getDate() + i - date.getDay())
              const isPast = date < new Date().setHours(0, 0, 0, 0)
              const isSelected = selectedDate?.toDateString() === date.toDateString()
              
              return (
                <Button
                  key={i}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  disabled={isPast}
                  onClick={() => handleDateSelect(date)}
                  className="h-8"
                >
                  {date.getDate()}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDate && availableSlots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Times</CardTitle>
            <CardDescription>
              Select a time slot for {selectedDate.toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant={selectedSlot === slot.time ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => slot.available && handleSlotSelect(slot.time)}
                  className="h-10"
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedDate && availableSlots.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No availability for {selectedDate.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      )}

      {selectedSlot && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Booking</CardTitle>
            <CardDescription>
              Book a 30-minute session on {selectedDate?.toLocaleDateString()} at {selectedSlot}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showBookingForm ? (
              <Button onClick={() => setShowBookingForm(true)} className="w-full">
                Book This Time Slot
              </Button>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {message && (
                  <div className={`p-3 rounded-md ${
                    message.includes('confirmed') 
                      ? 'bg-green-50 border border-green-200 text-green-600' 
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}>
                    {message}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
