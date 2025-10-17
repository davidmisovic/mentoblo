'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { DayOfWeek, TimeSlot, TutorAvailabilityInsert } from '@/types'

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

export default function TutorSetupPage() {
  const [availability, setAvailability] = useState<Record<number, TimeSlot[]>>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Initialize availability for each day
    const initialAvailability: Record<number, TimeSlot[]> = {}
    for (let i = 0; i < 7; i++) {
      initialAvailability[i] = []
    }
    setAvailability(initialAvailability)
  }, [])

  const addTimeSlot = (dayOfWeek: number) => {
    setAvailability(prev => ({
      ...prev,
      [dayOfWeek]: [...prev[dayOfWeek], { start_time: '09:00', end_time: '10:00' }]
    }))
  }

  const removeTimeSlot = (dayOfWeek: number, index: number) => {
    setAvailability(prev => ({
      ...prev,
      [dayOfWeek]: prev[dayOfWeek].filter((_, i) => i !== index)
    }))
  }

  const updateTimeSlot = (dayOfWeek: number, index: number, field: 'start_time' | 'end_time', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayOfWeek]: prev[dayOfWeek].map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }))
  }

  const handleSaveAvailability = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setMessage('Please sign in first')
        return
      }

      // Clear existing availability
      await supabase
        .from('tutor_availability')
        .delete()
        .eq('tutor_id', user.id)

      // Insert new availability
      const availabilityData: TutorAvailabilityInsert[] = []
      
      for (const [dayOfWeek, slots] of Object.entries(availability)) {
        for (const slot of slots) {
          availabilityData.push({
            tutor_id: user.id,
            day_of_week: parseInt(dayOfWeek),
            start_time: slot.start_time,
            end_time: slot.end_time
          })
        }
      }

      if (availabilityData.length > 0) {
        const { error } = await supabase
          .from('tutor_availability')
          .insert(availabilityData)

        if (error) {
          setMessage(error.message)
        } else {
          setMessage('Availability saved successfully!')
          setTimeout(() => {
            router.push('/tutor/dashboard')
          }, 1500)
        }
      } else {
        setMessage('Please add at least one time slot')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Set Your Availability
            </h1>
            <p className="text-lg text-gray-600">
              When are you available to teach? Students will be able to book sessions during these times.
            </p>
          </div>

          <div className="space-y-6">
            {DAYS_OF_WEEK.map((day, dayIndex) => (
              <Card key={dayIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{day}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addTimeSlot(dayIndex)}
                    >
                      Add Time Slot
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {availability[dayIndex]?.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No availability set for {day}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {availability[dayIndex]?.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">From:</label>
                            <input
                              type="time"
                              value={slot.start_time}
                              onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start_time', e.target.value)}
                              className="px-3 py-1 border rounded-md"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">To:</label>
                            <input
                              type="time"
                              value={slot.end_time}
                              onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end_time', e.target.value)}
                              className="px-3 py-1 border rounded-md"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {message && (
            <div className={`p-4 rounded-md ${
              message.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-600' 
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              {message}
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleSaveAvailability}
              disabled={loading}
              className="px-8"
            >
              {loading ? 'Saving...' : 'Save Availability'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
