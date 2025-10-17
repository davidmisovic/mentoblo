'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import type { Booking } from '@/types'

interface SharedNotesProps {
  session: Booking
  isTutor: boolean
}

export function SharedNotes({ session, isTutor }: SharedNotesProps) {
  const [notes, setNotes] = useState(session.session_notes_markdown || '')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const saveNotes = useCallback(async (notesToSave: string) => {
    if (!isTutor) return

    setIsSaving(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('bookings')
        .update({ session_notes_markdown: notesToSave })
        .eq('id', session.id)

      if (error) {
        console.error('Error saving notes:', error)
        return
      }

      setLastSaved(new Date())
    } catch (error) {
      console.error('Error saving notes:', error)
    } finally {
      setIsSaving(false)
    }
  }, [isTutor, session.id])

  // Debounced save function
  useEffect(() => {
    if (!isTutor) return

    const timeoutId = setTimeout(async () => {
      if (notes !== (session.session_notes_markdown || '')) {
        await saveNotes(notes)
      }
    }, 2000) // Save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [notes, isTutor, session.session_notes_markdown, saveNotes])

  const handleManualSave = async () => {
    await saveNotes(notes)
  }

  const formatLastSaved = () => {
    if (!lastSaved) return null
    return lastSaved.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          Session Notes
        </CardTitle>
        <CardDescription>
          {isTutor ? 'Take notes during the session (auto-saved)' : 'View session notes'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isTutor ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your session notes here... (Markdown supported)"
                rows={8}
                className="resize-none"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Supports Markdown formatting</span>
                <div className="flex items-center space-x-2">
                  {isSaving && (
                    <div className="flex items-center space-x-1">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600"></div>
                      <span>Saving...</span>
                    </div>
                  )}
                  {lastSaved && !isSaving && (
                    <span>Saved at {formatLastSaved()}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                onClick={handleManualSave}
                disabled={isSaving}
                size="sm"
                variant="outline"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Save Now
              </Button>
              
              <div className="text-xs text-gray-500">
                Auto-saves every 2 seconds
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {notes ? (
              <div className="prose max-w-none prose-sm">
                <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {notes}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No notes yet</p>
                <p className="text-gray-400 text-xs mt-1">Your tutor will add notes during the session</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
