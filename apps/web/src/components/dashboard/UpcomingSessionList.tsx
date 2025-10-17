'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/stripe'
import Link from 'next/link'
import type { Booking } from '@/types'

interface UpcomingSessionListProps {
  bookings: (Booking & {
    profiles?: {
      full_name: string | null
      avatar_url: string | null
    } | null
    payments?: {
      id: number
      status: string
      amount_cents: number
      tutor_earnings_cents: number
    }[]
  })[]
}

export function UpcomingSessionList({ bookings }: UpcomingSessionListProps) {
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

  const getStudentName = (booking: typeof bookings[0]) => {
    if (booking.student_id && booking.profiles) {
      return booking.profiles.full_name || 'Student'
    }
    return booking.guest_name || 'Guest'
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

  const getPaymentStatus = (booking: typeof bookings[0]) => {
    switch (booking.payment_status) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          Upcoming Sessions (Next 7 Days)
        </CardTitle>
        <CardDescription>
          Your scheduled tutoring sessions for the next week
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No upcoming sessions</p>
            <p className="text-gray-400 text-xs mt-1">Bookings will appear here when students schedule sessions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 4).map((booking) => {
              const { date, time } = formatDateTime(booking.start_time)
              const studentName = getStudentName(booking)
              const paymentStatus = getPaymentStatus(booking)

              return (
                <div
                  key={booking.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {studentName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{studentName}</h4>
                        <p className="text-sm text-gray-600">{date}</p>
                        <p className="text-sm text-gray-600">{time} (30 minutes)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(booking.status)}
                          <Badge className={paymentStatus.color}>
                            {paymentStatus.status}
                          </Badge>
                        </div>
                        {booking.payments && booking.payments.length > 0 && (
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(booking.payments[0].tutor_earnings_cents)}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/sessions/${booking.id}`}>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Go to Session
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {bookings.length > 4 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/bookings">
                View All Sessions ({bookings.length})
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
