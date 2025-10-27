import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import BookingCalendar from './BookingCalendar'
import Image from 'next/image'

interface PageProps {
  params: {
    slug: string
  }
}

async function getTutorBySlug(slug: string) {
  const { data: tutor, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, booking_slug')
    .eq('booking_slug', slug)
    .eq('role', 'tutor')
    .single()

  if (error || !tutor) {
    return null
  }

  return tutor
}

export default async function BookingPage({ params }: PageProps) {
  const tutor = await getTutorBySlug(params.slug)

  if (!tutor) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            {tutor.avatar_url && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={tutor.avatar_url}
                  alt={tutor.full_name || 'Tutor'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Book a lesson with {tutor.full_name}
              </h1>
              <p className="text-gray-600">
                Schedule your personalized tutoring session
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <BookingCalendar tutorId={tutor.id} tutorName={tutor.full_name || 'Tutor'} />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-gray-500">
            <p>Powered by Mentoblo - Professional Tutoring Platform</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const tutor = await getTutorBySlug(params.slug)

  if (!tutor) {
    return {
      title: 'Tutor Not Found',
    }
  }

  return {
    title: `Book a lesson with ${tutor.full_name} | Mentoblo`,
    description: `Schedule a personalized tutoring session with ${tutor.full_name}. Professional tutoring services through Mentoblo.`,
  }
}
