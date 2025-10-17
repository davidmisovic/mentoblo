'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Booking } from '@/types'

interface SessionHeaderProps {
  session: Booking & {
    profiles?: {
      full_name: string | null
      avatar_url: string | null
      public_handle: string | null
    } | null
  }
  isTutor: boolean
  isStudent: boolean
  date: string
  time: string
}

export function SessionHeader({ session, isTutor, isStudent, date, time }: SessionHeaderProps) {
  const getStudentName = () => {
    if (session.student_id && session.profiles) {
      return session.profiles.full_name || 'Student'
    }
    return session.guest_name || 'Guest'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getPaymentStatus = () => {
    switch (session.payment_status) {
      case 'paid':
        return { status: 'Paid', color: 'bg-green-100 text-green-800' }
      case 'processing':
        return { status: 'Processing', color: 'bg-yellow-100 text-yellow-800' }
      case 'unpaid':
        return { status: 'Unpaid', color: 'bg-red-100 text-red-800' }
      default:
        return { status: 'Unknown', color: 'bg-gray-100 text-gray-800' }
    }
  }

  const paymentStatus = getPaymentStatus()
  const studentName = getStudentName()

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              {session.profiles?.avatar_url ? (
                <img 
                  src={session.profiles.avatar_url} 
                  alt={studentName} 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-blue-600 font-bold text-xl">
                  {studentName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isTutor ? 'Teaching Session' : 'Learning Session'}
              </h1>
              <p className="text-lg text-gray-600">
                {isTutor ? `with ${studentName}` : `with your tutor`}
              </p>
              <p className="text-sm text-gray-500">
                {date} at {time}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(session.status)}
                <Badge className={paymentStatus.color}>
                  {paymentStatus.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {isTutor ? 'Student' : 'Tutor'}
              </p>
              <p className="font-medium text-gray-900">
                {isTutor ? studentName : 'Your Tutor'}
              </p>
              {session.profiles?.public_handle && (
                <p className="text-xs text-gray-500">
                  @{session.profiles.public_handle}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
