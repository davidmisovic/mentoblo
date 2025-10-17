'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Booking } from '@/types'

interface SessionNotesProps {
  session: Booking
  notes: any[]
  isTutor: boolean
}

export function SessionNotes({ session, notes, isTutor }: SessionNotesProps) {
  const [newNote, setNewNote] = useState('')
  const [noteTitle, setNoteTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddNote = async () => {
    if (!newNote.trim() || !noteTitle.trim()) return

    // In a real implementation, this would save to the database
    console.log('Adding note:', { title: noteTitle, content: newNote })
    
    setNewNote('')
    setNoteTitle('')
    setIsAdding(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
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
          {isTutor ? 'Take notes during the session' : 'View session notes'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Note */}
        {isTutor && (
          <div className="space-y-4">
            {!isAdding ? (
              <Button 
                onClick={() => setIsAdding(true)}
                variant="outline"
                className="w-full"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Note
              </Button>
            ) : (
              <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                <div>
                  <Label htmlFor="noteTitle">Note Title</Label>
                  <Input
                    id="noteTitle"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Enter note title..."
                  />
                </div>
                <div>
                  <Label htmlFor="newNote">Note Content</Label>
                  <Textarea
                    id="newNote"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write your note here..."
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddNote} size="sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Note
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsAdding(false)
                      setNewNote('')
                      setNoteTitle('')
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No notes yet</p>
              <p className="text-gray-400 text-xs mt-1">
                {isTutor ? 'Add notes to track session progress' : 'Notes will appear here when added'}
              </p>
            </div>
          ) : (
            notes.map((note, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{note.title || 'Untitled Note'}</h4>
                  <span className="text-xs text-gray-500">{formatDate(note.created_at)}</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {note.content || 'No content'}
                </p>
                {isTutor && (
                  <div className="mt-3 flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
