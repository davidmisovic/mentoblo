import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthButton } from '@/components/auth/auth-button'
import { VirtualClassroom } from '@/components/sessions/VirtualClassroom'
import { SessionNotes } from '@/components/sessions/SessionNotes'
import { SessionMaterials } from '@/components/sessions/SessionMaterials'
import { SessionDetails } from '@/components/sessions/SessionDetails'

interface SessionPageProps {
  params: {
    id: string
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
    .eq('id', params.id)
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

  // Get session notes (if any)
  const { data: notes } = await supabase
    .from('session_notes')
    .select('*')
    .eq('booking_id', session.id)
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
        <div className="max-w-7xl mx-auto">
          {/* Session Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {isTutor ? 'Teaching Session' : 'Learning Session'}
                </h1>
                <p className="text-lg text-gray-600">
                  {date} at {time}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {isTutor ? 'Student' : 'Tutor'}
                  </p>
                  <p className="font-medium text-gray-900">
                    {isTutor 
                      ? (session.profiles?.full_name || session.guest_name || 'Student')
                      : 'Your Tutor'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {session.profiles?.avatar_url ? (
                    <img 
                      src={session.profiles.avatar_url} 
                      alt={session.profiles.full_name || 'User'} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-600 font-medium">
                      {(session.profiles?.full_name || session.guest_name || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Virtual Classroom */}
            <div className="lg:col-span-2 space-y-8">
              <VirtualClassroom 
                session={session}
                isTutor={isTutor}
                isStudent={isStudent}
              />
              
              <SessionNotes 
                session={session}
                notes={notes || []}
                isTutor={isTutor}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <SessionDetails 
                session={session}
                isTutor={isTutor}
                isStudent={isStudent}
              />
              
              <SessionMaterials 
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
