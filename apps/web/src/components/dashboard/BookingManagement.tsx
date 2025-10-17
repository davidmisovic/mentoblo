'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/stripe'
import { markBookingAsCompleted, cancelBooking } from '@/lib/actions/bookings'
import { ReportGeneratorDialog } from './ReportGeneratorDialog'
import type { Booking, BookingStatus } from '@/types'

interface BookingManagementProps {
  bookings: (Booking & {
    profiles?: {
      full_name: string | null
      avatar_url: string | null
    }
    payments?: {
      id: number
      status: string
      amount_cents: number
      tutor_earnings_cents: number
    }[]
  })[]
}

export function BookingManagement({ bookings }: BookingManagementProps) {
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null)
  const [loading, setLoading] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportBooking, setReportBooking] = useState<typeof bookings[0] | null>(null)

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

  const getPaymentStatus = (booking: typeof bookings[0]) => {
    // Use the new payment_status field from bookings table
    switch (booking.payment_status) {
      case 'paid':
        return { status: 'paid', color: 'bg-green-100 text-green-800' }
      case 'processing':
        return { status: 'processing', color: 'bg-yellow-100 text-yellow-800' }
      case 'unpaid':
        return { status: 'unpaid', color: 'bg-red-100 text-red-800' }
      default:
        return { status: 'unknown', color: 'bg-gray-100 text-gray-800' }
    }
  }

  const getStudentName = (booking: typeof bookings[0]) => {
    if (booking.student_id && booking.profiles) {
      return booking.profiles.full_name || 'Student'
    }
    return booking.guest_name || 'Guest'
  }

  const getStudentEmail = (booking: typeof bookings[0]) => {
    if (booking.student_id && booking.profiles) {
      return 'Registered student'
    }
    return booking.guest_email || 'No email provided'
  }

  const handleMarkCompleted = async (bookingId: number) => {
    setLoading(bookingId)
    setMessage('')
    
    try {
      await markBookingAsCompleted(bookingId)
      setMessage('Session marked as completed successfully!')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to mark session as completed')
    }
    
    setLoading(null)
  }

  const handleCancelBooking = async (bookingId: number) => {
    setLoading(bookingId)
    setMessage('')

    try {
      await cancelBooking(bookingId)
      setMessage('Booking cancelled successfully!')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to cancel booking')
    }

    setLoading(null)
  }

  const handleGenerateReport = (booking: typeof bookings[0]) => {
    setReportBooking(booking)
    setShowReportDialog(true)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
        <CardDescription>
          Manage your upcoming tutoring sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming sessions</h3>
            <p className="text-gray-600 mb-4">
              When students book sessions with you, they'll appear here.
            </p>
            <Button variant="outline">
              Share Your Profile
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const { date, time } = formatDateTime(booking.start_time)
              const paymentStatus = getPaymentStatus(booking)
              const studentName = getStudentName(booking)
              const studentEmail = getStudentEmail(booking)

              return (
                <div
                  key={booking.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {studentName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{studentName}</h4>
                          <p className="text-sm text-gray-600">{studentEmail}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{date}</p>
                        <p>{time} (30 minutes)</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        <Badge className={paymentStatus.color}>
                          {paymentStatus.status}
                        </Badge>
                        {booking.payments && booking.payments.length > 0 && (
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(booking.payments[0].tutor_earnings_cents)}
                          </span>
                        )}
                      </div>
                      {booking.status === 'confirmed' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkCompleted(booking.id)}
                            disabled={loading === booking.id}
                          >
                            {loading === booking.id ? 'Processing...' : 'Mark Completed'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={loading === booking.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                      {(booking.status === 'confirmed' || booking.status === 'completed') && (
                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateReport(booking)}
                            className="text-purple-600 hover:text-purple-700 border-purple-200 hover:border-purple-300"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Generate Report
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {message && (
          <div className={`mt-4 p-4 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-600' 
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {message}
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Session Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Student Information</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {getStudentName(selectedBooking)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {getStudentEmail(selectedBooking)}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Session Details</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Date:</strong> {formatDateTime(selectedBooking.start_time).date}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Time:</strong> {formatDateTime(selectedBooking.start_time).time}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Duration:</strong> 30 minutes
                  </p>
                </div>

                {selectedBooking.payments && selectedBooking.payments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
                    <p className="text-sm text-gray-600">
                      <strong>Status:</strong> {getPaymentStatus(selectedBooking).status}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Your Earnings:</strong> {formatCurrency(selectedBooking.payments[0].tutor_earnings_cents)}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedBooking(null)}
                >
                  Close
                </Button>
                <Button className="flex-1">
                  Contact Student
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Report Generator Dialog */}
    {reportBooking && (
      <ReportGeneratorDialog
        booking={reportBooking}
        isOpen={showReportDialog}
        onClose={() => {
          setShowReportDialog(false)
          setReportBooking(null)
        }}
      />
    )}
  </>
  )
}
