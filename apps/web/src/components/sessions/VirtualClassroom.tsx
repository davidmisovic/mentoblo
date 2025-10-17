'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import type { Booking } from '@/types'

interface VirtualClassroomProps {
  session: Booking & {
    profiles?: {
      full_name: string | null
      avatar_url: string | null
      public_handle: string | null
    } | null
  }
  isTutor: boolean
  isStudent: boolean
}

export function VirtualClassroom({ session, isTutor, isStudent }: VirtualClassroomProps) {
  const [notes, setNotes] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [meetingLink, setMeetingLink] = useState('')

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

  const handleStartSession = () => {
    // In a real implementation, this would start a video call
    console.log('Starting session...')
  }

  const handleEndSession = () => {
    // In a real implementation, this would end the video call
    console.log('Ending session...')
  }

  const handleSaveNotes = () => {
    // In a real implementation, this would save notes to the database
    console.log('Saving notes:', notes)
  }

  const handleGenerateMeetingLink = () => {
    // In a real implementation, this would generate a meeting link
    const link = `https://meet.mentoblo.com/${session.id}-${Date.now()}`
    setMeetingLink(link)
  }

  const isSessionActive = () => {
    const now = new Date()
    const startTime = new Date(session.start_time)
    const endTime = new Date(session.end_time)
    return now >= startTime && now <= endTime
  }

  const canStartSession = () => {
    const now = new Date()
    const startTime = new Date(session.start_time)
    const timeDiff = startTime.getTime() - now.getTime()
    return timeDiff <= 15 * 60 * 1000 // 15 minutes before start time
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          Virtual Classroom
        </CardTitle>
        <CardDescription>
          {isTutor ? 'Manage your teaching session' : 'Join your learning session'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Session Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-gray-900">Session Status</span>
            {getStatusBadge(session.status)}
          </div>
          <div className="text-sm text-gray-600">
            {isSessionActive() ? 'Session is active' : 'Session not started'}
          </div>
        </div>

        {/* Meeting Link */}
        {meetingLink ? (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Meeting Link</h4>
            <div className="flex items-center space-x-2">
              <Input 
                value={meetingLink} 
                readOnly 
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={() => navigator.clipboard.writeText(meetingLink)}
              >
                Copy
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Meeting Link</h3>
            <p className="text-gray-600 mb-4">
              {isTutor 
                ? 'Generate a meeting link to start your session'
                : 'Waiting for your tutor to start the session'
              }
            </p>
            {isTutor && (
              <Button onClick={handleGenerateMeetingLink}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Meeting Link
              </Button>
            )}
          </div>
        )}

        {/* Session Controls */}
        {meetingLink && (
          <div className="flex space-x-3">
            {isTutor && (
              <>
                <Button 
                  onClick={handleStartSession}
                  disabled={!canStartSession() || isRecording}
                  className="flex-1"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                  Start Session
                </Button>
                <Button 
                  onClick={handleEndSession}
                  variant="outline"
                  className="flex-1"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10l2 2 4-4" />
                  </svg>
                  End Session
                </Button>
              </>
            )}
            {isStudent && (
              <Button 
                onClick={handleStartSession}
                className="flex-1"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Join Session
              </Button>
            )}
          </div>
        )}

        {/* Session Notes */}
        {isTutor && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Session Notes</h4>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes during the session..."
              rows={4}
            />
            <Button onClick={handleSaveNotes} size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Save Notes
            </Button>
          </div>
        )}

        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-700 font-medium">Recording in progress...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
