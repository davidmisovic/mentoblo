'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Clock, User, Mail, CheckCircle } from 'lucide-react'
import { createBooking } from './actions'

// Validation schema
const bookingSchema = z.object({
  student_name: z.string().min(2, 'Name must be at least 2 characters'),
  student_email: z.string().email('Please enter a valid email address'),
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingCalendarProps {
  tutorId: string
  tutorName: string
}

// Hardcoded available time slots
const AVAILABLE_TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
]

// Generate calendar days for current month
function generateCalendarDays() {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const currentDate = new Date(startDate)
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return days
}

export default function BookingCalendar({ tutorId, tutorName }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const calendarDays = generateCalendarDays()
  const today = new Date()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  const handleDateClick = (date: Date) => {
    // Only allow future dates
    if (date >= today) {
      setSelectedDate(date)
      setSelectedTime(null)
      setIsSuccess(false)
    }
  }

  const handleTimeClick = (time: string) => {
    setSelectedTime(time)
    setIsSuccess(false)
  }

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) return

    setIsSubmitting(true)

    try {
      // Create start and end times
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const startTime = new Date(selectedDate)
      startTime.setHours(hours, minutes, 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setHours(hours + 1, minutes, 0, 0)

      const result = await createBooking({
        tutorId,
        studentName: data.student_name,
        studentEmail: data.student_email,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      })

      if (result.success) {
        setIsSuccess(true)
        reset()
        setSelectedDate(null)
        setSelectedTime(null)
      } else {
        alert(result.error || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('An error occurred while creating your booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isCurrentMonth = (date: Date) => {
    const today = new Date()
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="text-sm font-medium text-green-800">Booking Confirmed!</h3>
            <p className="text-sm text-green-700">
              Your lesson has been scheduled. You'll receive a confirmation email shortly.
            </p>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Select a Date
        </h2>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const isCurrentMonthDay = isCurrentMonth(date)
            const isPast = isPastDate(date)
            const isSelected = selectedDate?.toDateString() === date.toDateString()
            
            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={isPast}
                className={`
                  p-2 text-sm rounded-lg transition-colors
                  ${isCurrentMonthDay ? 'text-gray-900' : 'text-gray-400'}
                  ${isPast ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}
                  ${isSelected ? 'bg-blue-100 text-blue-900 font-medium' : ''}
                  ${!isCurrentMonthDay ? 'bg-gray-50' : ''}
                `}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Available Times for {formatDate(selectedDate)}
          </h3>
          
          <div className="grid grid-cols-5 gap-2">
            {AVAILABLE_TIME_SLOTS.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className={`
                  p-3 text-sm font-medium rounded-lg border transition-colors
                  ${selectedTime === time
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }
                `}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Booking Form */}
      {selectedDate && selectedTime && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Complete Your Booking
          </h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="student_name" className="block text-sm font-medium text-gray-700 mb-1">
                <User className="h-4 w-4 inline mr-1" />
                Full Name
              </label>
              <input
                {...register('student_name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
              {errors.student_name && (
                <p className="mt-1 text-sm text-red-600">{errors.student_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="student_email" className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="h-4 w-4 inline mr-1" />
                Email Address
              </label>
              <input
                {...register('student_email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
              {errors.student_email && (
                <p className="mt-1 text-sm text-red-600">{errors.student_email.message}</p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
              <p className="text-sm text-gray-600">
                <strong>Date:</strong> {formatDate(selectedDate)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Time:</strong> {selectedTime} - {String(Number(selectedTime.split(':')[0]) + 1).padStart(2, '0')}:{selectedTime.split(':')[1]}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Tutor:</strong> {tutorName}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
