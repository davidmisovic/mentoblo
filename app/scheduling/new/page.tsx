'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Student {
  id: string
  name: string
  email?: string
}

export default function NewLesson() {
  const [students, setStudents] = useState<Student[]>([])
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    description: '',
    subject: '',
    start_time: '',
    end_time: '',
    price: '',
    meeting_link: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
        return
      }
      fetchStudents()
    }
    checkUser()

    // Pre-fill student if provided in URL
    const studentId = searchParams.get('student')
    if (studentId) {
      setFormData(prev => ({ ...prev, student_id: studentId }))
    }
  }, [router, supabase.auth, searchParams])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const data = await response.json()
      if (response.ok) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null
        }),
      })

      if (response.ok) {
        router.push('/scheduling')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create lesson')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const calculateEndTime = (startTime: string, duration: number) => {
    if (!startTime) return ''
    const start = new Date(startTime)
    const end = new Date(start.getTime() + duration * 60000)
    return end.toISOString().slice(0, 16)
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
          <Link href="/scheduling" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Scheduling
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Schedule New Lesson</h1>
          <p className="text-neutral-600">Create a new lesson with a student.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Lesson Details</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="student_id" className="block text-sm font-medium text-neutral-700">
                  Student *
                </label>
                <select
                  id="student_id"
                  required
                  value={formData.student_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} {student.email && `(${student.email})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="e.g., Algebra Basics, English Conversation"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="e.g., Mathematics, English"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="Brief description of what will be covered..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Schedule</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-neutral-700">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  id="start_time"
                  required
                  value={formData.start_time}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, start_time: e.target.value }))
                    // Auto-calculate end time if not set
                    if (!formData.end_time && e.target.value) {
                      const endTime = calculateEndTime(e.target.value, 60) // Default 60 minutes
                      setFormData(prev => ({ ...prev, end_time: endTime }))
                    }
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>

              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-neutral-700">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  id="end_time"
                  required
                  value={formData.end_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Quick Duration
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (formData.start_time) {
                      const endTime = calculateEndTime(formData.start_time, 30)
                      setFormData(prev => ({ ...prev, end_time: endTime }))
                    }
                  }}
                  className="px-3 py-1 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50"
                >
                  30 min
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (formData.start_time) {
                      const endTime = calculateEndTime(formData.start_time, 60)
                      setFormData(prev => ({ ...prev, end_time: endTime }))
                    }
                  }}
                  className="px-3 py-1 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50"
                >
                  1 hour
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (formData.start_time) {
                      const endTime = calculateEndTime(formData.start_time, 90)
                      setFormData(prev => ({ ...prev, end_time: endTime }))
                    }
                  }}
                  className="px-3 py-1 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50"
                >
                  1.5 hours
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (formData.start_time) {
                      const endTime = calculateEndTime(formData.start_time, 120)
                      setFormData(prev => ({ ...prev, end_time: endTime }))
                    }
                  }}
                  className="px-3 py-1 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50"
                >
                  2 hours
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Payment & Details</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-neutral-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="meeting_link" className="block text-sm font-medium text-neutral-700">
                  Meeting Link
                </label>
                <input
                  type="url"
                  id="meeting_link"
                  value={formData.meeting_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, meeting_link: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-neutral-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="Any additional notes for this lesson..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link href="/scheduling" className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 border border-transparent rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Lesson'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
