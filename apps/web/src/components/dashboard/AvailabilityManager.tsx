'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TutorAvailability, TimeSlot } from '@/types'

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

interface AvailabilityManagerProps {
  initialAvailability: TutorAvailability[]
  tutorId: string
}

export function AvailabilityManager({ initialAvailability, tutorId }: AvailabilityManagerProps) {
  const [availability, setAvailability] = useState<Record<number, TimeSlot[]>>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    // Initialize availability from existing data
    const initialData: Record<number, TimeSlot[]> = {}
    for (let i = 0; i < 7; i++) {
      initialData[i] = []
    }

    // Populate with existing availability
    initialAvailability.forEach(slot => {
      if (!initialData[slot.day_of_week]) {
        initialData[slot.day_of_week] = []
      }
      initialData[slot.day_of_week].push({
        start_time: slot.start_time,
        end_time: slot.end_time
      })
    })

    setAvailability(initialData)
  }, [initialAvailability])

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
      // Clear existing availability
      await supabase
        .from('tutor_availability')
        .delete()
        .eq('tutor_id', tutorId)

      // Insert new availability
      const availabilityData = []
      
      for (const [dayOfWeek, slots] of Object.entries(availability)) {
        for (const slot of slots) {
          availabilityData.push({
            tutor_id: tutorId,
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
                      <Input
                        type="time"
                        value={slot.start_time}
                        onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start_time', e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">To:</label>
                      <Input
                        type="time"
                        value={slot.end_time}
                        onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end_time', e.target.value)}
                        className="w-32"
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

      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-600' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSaveAvailability}
          disabled={loading}
          className="px-8"
        >
          {loading ? 'Saving...' : 'Save Availability'}
        </Button>
      </div>
    </div>
  )
}
