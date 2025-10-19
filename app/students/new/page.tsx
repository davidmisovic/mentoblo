'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function NewStudent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    subjects: [] as string[],
    level: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/students')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create student')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s !== subject)
      }))
    }
  }

  const availableSubjects = [
    'Mathematics', 'English', 'Science', 'Physics', 'Chemistry', 'Biology',
    'History', 'Geography', 'French', 'Spanish', 'German', 'Italian',
    'Computer Science', 'Economics', 'Business Studies', 'Art', 'Music'
  ]

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
              <Link href="/scheduling" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Scheduling</Link>
              <Link href="/students" className="text-[14px] text-neutral-900 font-medium">Students</Link>
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
          <Link href="/students" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Students
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Add New Student</h1>
          <p className="text-neutral-600">Enter the student's information to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Student Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                  Student Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                  Student Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                  Student Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-neutral-700">
                  Level
                </label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Subjects
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSubjects.map((subject) => (
                  <label key={subject} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                      className="h-4 w-4 text-neutral-600 focus:ring-neutral-500 border-neutral-300 rounded"
                    />
                    <span className="ml-2 text-sm text-neutral-700">{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="notes" className="block text-sm font-medium text-neutral-700">
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                placeholder="Any additional notes about the student..."
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Parent/Guardian Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="parent_name" className="block text-sm font-medium text-neutral-700">
                  Parent/Guardian Name
                </label>
                <input
                  type="text"
                  id="parent_name"
                  value={formData.parent_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, parent_name: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>

              <div>
                <label htmlFor="parent_email" className="block text-sm font-medium text-neutral-700">
                  Parent/Guardian Email
                </label>
                <input
                  type="email"
                  id="parent_email"
                  value={formData.parent_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, parent_email: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>

              <div>
                <label htmlFor="parent_phone" className="block text-sm font-medium text-neutral-700">
                  Parent/Guardian Phone
                </label>
                <input
                  type="tel"
                  id="parent_phone"
                  value={formData.parent_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, parent_phone: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link href="/students" className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 border border-transparent rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Student'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
