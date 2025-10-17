import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthButton } from '@/components/auth/auth-button'
import { SessionHeader } from '@/components/sessions/SessionHeader'
import { MeetingLink } from '@/components/sessions/MeetingLink'
import { SharedNotes } from '@/components/sessions/SharedNotes'
import { SessionFiles } from '@/components/sessions/SessionFiles'

interface SessionPageProps {
  params: {
    bookingId: string
  }
}

export default async function SessionPage({ params }: SessionPageProps) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get the session details
  const { data: session, error } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles!bookings_student_id_fkey (
        full_name,
        avatar_url,
        public_handle
      )
    `)
    .eq('id', params.bookingId)
    .single()

  if (error || !session) {
    redirect('/dashboard')
  }

  // Check if user is authorized to view this session
  const isTutor = session.tutor_id === user.id
  const isStudent = session.student_id === user.id

  if (!isTutor && !isStudent) {
    redirect('/dashboard')
  }

  // Get session materials
  const { data: materials } = await supabase
    .from('shared_materials')
    .select('*')
    .eq('tutor_id', session.tutor_id)
    .or(`student_id.is.null,student_id.eq.${session.student_id || 'null'}`)
    .order('created_at', { ascending: false })

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const { date, time } = formatDateTime(session.start_time)

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
        <div className="max-w-6xl mx-auto">
          {/* Session Header */}
          <SessionHeader 
            session={session}
            isTutor={isTutor}
            isStudent={isStudent}
            date={date}
            time={time}
          />

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Meeting Link */}
              <MeetingLink 
                session={session}
                isTutor={isTutor}
              />
              
              {/* Shared Notes */}
              <SharedNotes 
                session={session}
                isTutor={isTutor}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Session Files */}
              <SessionFiles 
                session={session}
                materials={materials || []}
                isTutor={isTutor}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
