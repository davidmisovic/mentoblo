'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Student {
  id: string
  name: string
  email?: string
  phone?: string
  parent_name?: string
  parent_email?: string
  parent_phone?: string
  subjects?: string[]
  level?: string
  notes?: string
  created_at: string
}

export default function StudentDetail() {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
        return
      }
      fetchStudent()
    }
    checkUser()
  }, [router, studentId])

  const fetchStudent = async () => {
    try {
      const response = await fetch('/api/students')
      const data = await response.json()
      
      if (response.ok) {
        const foundStudent = data.students.find((s: Student) => s.id === studentId)
        if (foundStudent) {
          setStudent(foundStudent)
        } else {
          setError('Student not found')
        }
      } else {
        setError('Failed to fetch student')
      }
    } catch (error) {
      console.error('Error fetching student:', error)
      setError('Failed to fetch student')
    } finally {
      setLoading(false)
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

  if (error || !student) {
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

        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-4">Student Not Found</h1>
            <p className="text-neutral-600 mb-6">{error}</p>
            <Link
              href="/students"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Back to Students
            </Link>
          </div>
        </main>
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
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link href="/students" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Students
          </Link>
          <h1 className="text-2xl font-semibold text-neutral-900 mt-4">{student.name}</h1>
          <p className="text-neutral-600">Student Information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                  <p className="text-sm text-neutral-900">{student.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Level</label>
                  <p className="text-sm text-neutral-900">{student.level || 'Not specified'}</p>
                </div>
                {student.email && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                    <p className="text-sm text-neutral-900">{student.email}</p>
                  </div>
                )}
                {student.phone && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                    <p className="text-sm text-neutral-900">{student.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {student.subjects && student.subjects.length > 0 && (
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h2 className="text-lg font-medium text-neutral-900 mb-4">Subjects</h2>
                <div className="flex flex-wrap gap-2">
                  {student.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {student.notes && (
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h2 className="text-lg font-medium text-neutral-900 mb-4">Notes</h2>
                <p className="text-sm text-neutral-700">{student.notes}</p>
              </div>
            )}

            {/* Parent Information */}
            {(student.parent_name || student.parent_email || student.parent_phone) && (
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h2 className="text-lg font-medium text-neutral-900 mb-4">Parent Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {student.parent_name && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Parent Name</label>
                      <p className="text-sm text-neutral-900">{student.parent_name}</p>
                    </div>
                  )}
                  {student.parent_email && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Parent Email</label>
                      <p className="text-sm text-neutral-900">{student.parent_email}</p>
                    </div>
                  )}
                  {student.parent_phone && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Parent Phone</label>
                      <p className="text-sm text-neutral-900">{student.parent_phone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Lesson
                </button>
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Student
                </button>
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Create Invoice
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Lessons Completed</span>
                  <span className="text-sm font-medium text-neutral-900">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Total Hours</span>
                  <span className="text-sm font-medium text-neutral-900">0h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Last Lesson</span>
                  <span className="text-sm font-medium text-neutral-900">Never</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
