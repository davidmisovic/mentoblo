import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthButton } from '@/components/auth/auth-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AvailabilityManager } from '@/components/dashboard/AvailabilityManager'

export default async function AvailabilitySettingsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Redirect if not a tutor
  if (profile?.user_role !== 'tutor') {
    redirect('/dashboard')
  }

  // Get existing availability
  const { data: availability } = await supabase
    .from('tutor_availability')
    .select('*')
    .eq('tutor_id', user.id)
    .order('day_of_week')

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
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Set Your Availability
            </h1>
            <p className="text-lg text-gray-600">
              When are you available to teach? Students will be able to book sessions during these times.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                Set your recurring availability for each day of the week. You can add multiple time slots per day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvailabilityManager 
                initialAvailability={availability || []}
                tutorId={user.id}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
