import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import type { Profile, TutorAvailability, Booking } from '@/types'

interface TutorProfilePageProps {
  params: {
    handle: string
  }
}

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

export default async function TutorProfilePage({ params }: TutorProfilePageProps) {
  const supabase = createClient()
  const { handle } = params

  // Get tutor profile by public handle
  const { data: tutor } = await supabase
    .from('profiles')
    .select('*')
    .eq('public_handle', handle)
    .eq('user_role', 'tutor')
    .single()

  if (!tutor) {
    notFound()
  }

  // Get tutor's availability
  const { data: availability } = await supabase
    .from('tutor_availability')
    .select('*')
    .eq('tutor_id', tutor.id)
    .order('day_of_week')

  // Get tutor's existing bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('tutor_id', tutor.id)
    .in('status', ['confirmed', 'completed'])
    .gte('start_time', new Date().toISOString())
    .order('start_time')

  // Group availability by day
  const availabilityByDay = availability?.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) {
      acc[slot.day_of_week] = []
    }
    acc[slot.day_of_week].push(slot)
    return acc
  }, {} as Record<number, TutorAvailability[]>) || {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Mentoblo</span>
            </div>
            <Button variant="outline">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tutor Profile */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {tutor.full_name?.charAt(0) || tutor.public_handle?.charAt(0) || 'T'}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {tutor.full_name || 'Tutor'}
                  </h1>
                  {tutor.headline && (
                    <p className="text-blue-600 font-medium mb-2">
                      {tutor.headline}
                    </p>
                  )}
                  <p className="text-lg text-gray-600 mb-4">
                    Available for tutoring sessions
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="text-sm">
                      Tutor
                    </Badge>
                    <span className="text-sm text-gray-500">
                      @{tutor.public_handle}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Button size="lg" className="mb-2">
                    Book a Session
                  </Button>
                  <p className="text-sm text-gray-500">
                    Free consultation available
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          {tutor.bio && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About {tutor.full_name || 'this tutor'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {tutor.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Availability */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>
                When this tutor is available for sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(availabilityByDay).length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(availabilityByDay).map(([dayOfWeek, slots]) => (
                    <div key={dayOfWeek} className="space-y-2">
                      <h4 className="font-semibold text-gray-900">
                        {DAYS_OF_WEEK[parseInt(dayOfWeek)]}
                      </h4>
                      <div className="space-y-1">
                        {(slots as TutorAvailability[]).map((slot, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {slot.start_time} - {slot.end_time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No availability set yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Booking Calendar */}
          <BookingCalendar 
            tutorId={tutor.id}
            availability={availability || []}
            existingBookings={bookings || []}
          />
        </div>
      </main>
    </div>
  )
}
