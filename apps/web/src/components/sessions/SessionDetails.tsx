'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Booking } from '@/types'

interface SessionDetailsProps {
  session: Booking
  isTutor: boolean
}

export function SessionDetails({ session, isTutor }: SessionDetailsProps) {
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
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
      case 'unpaid':
        return <Badge className="bg-red-100 text-red-800">Unpaid</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const { date, time } = formatDateTime(session.start_time)
  const endTime = new Date(session.end_time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  const getStudentName = () => {
    if (session.student_id) {
      return 'Student' // In a real app, you'd fetch the student name
    }
    return session.guest_name || 'Guest'
  }

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            Session Details
          </CardTitle>
          <CardDescription>
            {isTutor ? 'Manage your tutoring session' : 'Your tutoring session information'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Student</h4>
              <p className="text-gray-600">{getStudentName()}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Date & Time</h4>
              <p className="text-gray-600">{date}</p>
              <p className="text-sm text-gray-500">{time} - {endTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Status</h4>
              {getStatusBadge(session.status)}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Payment</h4>
              {getPaymentStatusBadge(session.payment_status)}
            </div>
          </div>

          {session.guest_email && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
              <p className="text-gray-600">{session.guest_email}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Actions */}
      {isTutor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              Session Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V5a2 2 0 00-2-2h-2m-2-4v8m0 0l3-3m-3 3L9 8m-5 5v2a2 2 0 002 2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H20a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                </svg>
                Edit Session
              </Button>
              
              {session.status === 'confirmed' && (
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mark Complete
                </Button>
              )}
              
              {session.status === 'confirmed' && (
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Session
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
