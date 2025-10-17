'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Booking } from '@/types'

interface MeetingLinkProps {
  session: Booking
  isTutor: boolean
}

export function MeetingLink({ session, isTutor }: MeetingLinkProps) {
  const [meetingLink, setMeetingLink] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateLink = async () => {
    setIsGenerating(true)
    
    // In a real implementation, this would integrate with Google Meet or Zoom API
    // For now, we'll generate a placeholder link
    const link = `https://meet.google.com/mentoblo-${session.id}-${Date.now()}`
    setMeetingLink(link)
    
    setIsGenerating(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink)
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
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          Meeting Link
        </CardTitle>
        <CardDescription>
          {isTutor ? 'Generate and share the meeting link' : 'Join your tutoring session'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!meetingLink ? (
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
              <Button 
                onClick={handleGenerateLink}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Meeting Link
                  </div>
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Meeting Link Ready</h4>
              <div className="flex items-center space-x-2">
                <Input 
                  value={meetingLink} 
                  readOnly 
                  className="flex-1"
                />
                <Button 
                  size="sm" 
                  onClick={handleCopyLink}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </Button>
              </div>
            </div>

            {/* Join/Start Session Button */}
            <div className="flex space-x-3">
              <Button 
                onClick={() => window.open(meetingLink, '_blank')}
                className="flex-1"
                disabled={!canStartSession() && !isSessionActive()}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {isTutor ? 'Start Session' : 'Join Session'}
              </Button>
              
              {isTutor && (
                <Button 
                  variant="outline"
                  onClick={() => setMeetingLink('')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reset
                </Button>
              )}
            </div>

            {/* Session Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isSessionActive() ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-900">
                  {isSessionActive() ? 'Session Active' : 'Session Not Started'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {canStartSession() ? 'Ready to start' : 'Session not ready'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
