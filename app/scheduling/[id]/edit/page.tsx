'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Lesson {
  id: string
  title: string
  description?: string
  subject?: string
  start_time: string
  end_time: string
  status: string
  price?: number
  student_name?: string
  student_id?: string
  notes?: string
  meeting_link?: string
}

interface Student {
  id: string
  name: string
  email?: string
  phone?: string
}

export default function EditLesson() {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const lessonId = params.id as string

  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    description: '',
    subject: '',
    start_time: '',
    end_time: '',
    price: '',
    meeting_link: '',
    notes: '',
    status: 'scheduled'
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
        return
      }
      fetchLesson()
      fetchStudents()
    }
    checkUser()
  }, [router, lessonId])

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`)
      if (response.ok) {
        const data = await response.json()
        setLesson(data.lesson)
        
        // Populate form with lesson data
        setFormData({
          student_id: data.lesson.student_id || '',
          title: data.lesson.title || '',
          description: data.lesson.description || '',
          subject: data.lesson.subject || '',
          start_time: data.lesson.start_time ? new Date(data.lesson.start_time).toISOString().slice(0, 16) : '',
          end_time: data.lesson.end_time ? new Date(data.lesson.end_time).toISOString().slice(0, 16) : '',
          price: data.lesson.price?.toString() || '',
          meeting_link: data.lesson.meeting_link || '',
          notes: data.lesson.notes || '',
          status: data.lesson.status || 'scheduled'
        })
      } else {
        setError('Lesson not found')
      }
    } catch (error) {
      console.error('Error fetching lesson:', error)
      setError('Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 0
    const start = new Date(startTime)
    const end = new Date(endTime)
    return Math.round((end.getTime() - start.getTime()) / 60000) // duration in minutes
  }

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    if (!startTime) return ''
    const start = new Date(startTime)
    const end = new Date(start.getTime() + durationMinutes * 60000)
    return end.toISOString().slice(0, 16)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          duration: calculateDuration(formData.start_time, formData.end_time)
        }),
      })

      if (response.ok) {
        router.push('/scheduling')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update lesson')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
          <p className="mt-2 text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !lesson) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-4">Lesson Not Found</h1>
          <p className="text-neutral-600 mb-6">{error}</p>
          <Link href="/scheduling" className="inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
            Back to Scheduling
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[8px] border border-neutral-200 bg-white shadow-sm grid place-items-center">
                <span className="text-[13px] font-medium tracking-tight text-neutral-900">M</span>
              </div>
              <span className="text-[15px] font-medium tracking-tight text-neutral-900">Mentoblo</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/dashboard" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Dashboard</Link>
              <Link href="/scheduling" className="text-[14px] text-neutral-900 font-medium">Scheduling</Link>
              <Link href="/students" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Students</Link>
              <Link href="/invoicing" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Invoicing</Link>
              <Link href="/ai" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">AI Tools</Link>
            </nav>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/')
                }}
                className="text-[14px] text-neutral-700 hover:text-neutral-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link href="/scheduling" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Scheduling
          </Link>
          <h1 className="text-2xl font-semibold text-neutral-900">Edit Lesson</h1>
          <p className="text-neutral-600">Update lesson details and scheduling information.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Student *
            </label>
            <select
              value={formData.student_id}
              onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Lesson Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              placeholder="e.g., Math Tutoring Session"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              rows={3}
              placeholder="Brief description of the lesson content"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              placeholder="e.g., Mathematics, English, Science"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => {
                  const newStartTime = e.target.value
                  setFormData(prev => ({ ...prev, start_time: newStartTime }))
                  // Auto-calculate end time if not set or if current end time is invalid
                  if (newStartTime) {
                    const currentEndTime = formData.end_time
                    const currentDuration = calculateDuration(newStartTime, currentEndTime)
                    
                    // If no end time set or duration is negative/invalid, set default 60 minutes
                    if (!currentEndTime || currentDuration <= 0) {
                      const endTime = calculateEndTime(newStartTime, 60) // Default 60 minutes
                      setFormData(prev => ({ ...prev, end_time: endTime }))
                    }
                  }
                }}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => {
                  const newEndTime = e.target.value
                  const startTime = formData.start_time
                  
                  // Validate that end time is after start time
                  if (startTime && newEndTime) {
                    const start = new Date(startTime)
                    const end = new Date(newEndTime)
                    if (end <= start) {
                      setError('End time must be after start time')
                      return
                    }
                  }
                  
                  setFormData(prev => ({ ...prev, end_time: newEndTime }))
                  setError('') // Clear any previous errors
                }}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                required
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Price (per hour)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              placeholder="0.00"
            />
          </div>

          {/* Meeting Link */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Meeting Link
            </label>
            <input
              type="url"
              value={formData.meeting_link}
              onChange={(e) => setFormData(prev => ({ ...prev, meeting_link: e.target.value }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              placeholder="https://meet.google.com/..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              rows={3}
              placeholder="Additional notes about the lesson"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Lesson
                </>
              )}
            </button>
            <Link
              href="/scheduling"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
