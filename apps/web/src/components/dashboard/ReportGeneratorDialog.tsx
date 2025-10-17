'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { generateStudentReport } from '@/lib/actions/ai'
import type { Booking } from '@/types'

interface ReportGeneratorDialogProps {
  booking: Booking & {
    profiles?: {
      full_name: string | null
      avatar_url: string | null
    } | null
  }
  isOpen: boolean
  onClose: () => void
}

export function ReportGeneratorDialog({ booking, isOpen, onClose }: ReportGeneratorDialogProps) {
  const [summaryPoints, setSummaryPoints] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [generatedReport, setGeneratedReport] = useState('')

  const getStudentName = () => {
    if (booking.student_id && booking.profiles) {
      return booking.profiles.full_name || 'Student'
    }
    return booking.guest_name || 'Guest'
  }

  const getStudentEmail = () => {
    if (booking.student_id && booking.profiles) {
      return 'Registered student'
    }
    return booking.guest_email || 'No email provided'
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString('en-US', {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setGeneratedReport('')

    try {
      const result = await generateStudentReport(summaryPoints, booking.id)
      if (result.success) {
        setMessage('Student report generated successfully!')
        setGeneratedReport(result.generatedText || '')
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to generate student report')
    }

    setLoading(false)
  }

  const handleClose = () => {
    setSummaryPoints('')
    setMessage('')
    setGeneratedReport('')
    onClose()
  }

  if (!isOpen) return null

  const { date, time } = formatDateTime(booking.start_time)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Generate Student Report</h2>
              <p className="text-gray-600">Create a professional feedback report for this session</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Session Details */}
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
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Student</Label>
                  <p className="text-gray-900">{getStudentName()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-gray-900">{getStudentEmail()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Date & Time</Label>
                  <p className="text-gray-900">{date} at {time}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Duration</Label>
                  <p className="text-gray-900">30 minutes</p>
                </div>
              </CardContent>
            </Card>

            {/* Report Generator Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  AI Report Generator
                </CardTitle>
                <CardDescription>
                  Provide key points from the session to generate a professional feedback report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="summaryPoints">Session Summary Points *</Label>
                    <Textarea
                      id="summaryPoints"
                      value={summaryPoints}
                      onChange={(e) => setSummaryPoints(e.target.value)}
                      placeholder="Enter key points from the session, such as:
• Topics covered
• Student's strengths demonstrated
• Areas that need improvement
• Specific examples of progress
• Any challenges or breakthroughs"
                      rows={6}
                      required
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      Be specific and detailed. The AI will use these points to create a professional report.
                    </p>
                  </div>

                  {message && (
                    <div className={`p-3 rounded-md ${
                      message.includes('successfully')
                        ? 'bg-green-50 border border-green-200 text-green-600'
                        : 'bg-red-50 border border-red-200 text-red-600'
                    }`}>
                      <p className="text-sm">{message}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !summaryPoints.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Report...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Generate AI Report
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Generated Report Display */}
          {generatedReport && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Generated Student Report
                </CardTitle>
                <CardDescription>
                  Your AI-generated feedback report is ready! You can copy this content to share with the student or parent.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {generatedReport}
                  </pre>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => navigator.clipboard.writeText(generatedReport)}
                    className="flex-1"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Report
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
