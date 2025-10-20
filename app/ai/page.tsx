'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AITools() {
  const [loading, setLoading] = useState(false)
  const [lessonPlan, setLessonPlan] = useState('')
  const [parentReport, setParentReport] = useState('')
  const router = useRouter()

  const generateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/ai/lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        setLessonPlan(result.lessonPlan)
      } else {
        const errorData = await response.json()
        console.error('Failed to generate lesson plan:', errorData.error)
      }
    } catch (error) {
      console.error('Error generating lesson plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateParentReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/ai/parent-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        setParentReport(result.parentReport)
      } else {
        const errorData = await response.json()
        console.error('Failed to generate parent report:', errorData.error)
      }
    } catch (error) {
      console.error('Error generating parent report:', error)
    } finally {
      setLoading(false)
    }
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
              <Link href="/students" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Students</Link>
              <Link href="/invoicing" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Invoicing</Link>
              <Link href="/ai" className="text-[14px] text-neutral-900 font-medium">AI Tools</Link>
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">AI Tools</h1>
          <p className="text-neutral-600">Leverage AI to create lesson plans, generate reports, and enhance your teaching.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lesson Planner */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-lg font-medium text-neutral-900">Lesson Planner</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-6">Generate detailed lesson plans tailored to your student's needs and level.</p>

            <form onSubmit={generateLessonPlan} className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="e.g., Mathematics, English, Physics"
                />
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-neutral-700">
                  Level *
                </label>
                <select
                  id="level"
                  name="level"
                  required
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

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-neutral-700">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  required
                  min="30"
                  max="180"
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="60"
                />
              </div>

              <div>
                <label htmlFor="student_name" className="block text-sm font-medium text-neutral-700">
                  Student Name
                </label>
                <input
                  type="text"
                  id="student_name"
                  name="student_name"
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="e.g., Sarah"
                />
              </div>

              <div>
                <label htmlFor="learning_objectives" className="block text-sm font-medium text-neutral-700">
                  Learning Objectives *
                </label>
                <textarea
                  id="learning_objectives"
                  name="learning_objectives"
                  required
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="What should the student learn in this lesson?"
                />
              </div>

              <div>
                <label htmlFor="previous_topics" className="block text-sm font-medium text-neutral-700">
                  Previous Topics Covered
                </label>
                <textarea
                  id="previous_topics"
                  name="previous_topics"
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="What has the student already covered?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-900"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Lesson Plan
                  </>
                )}
              </button>
            </form>

            {lessonPlan && (
              <div className="mt-6 p-4 bg-neutral-50 rounded-md">
                <h3 className="text-sm font-medium text-neutral-900 mb-2">Generated Lesson Plan:</h3>
                <div className="text-sm text-neutral-700 whitespace-pre-wrap">{lessonPlan}</div>
              </div>
            )}
          </div>

          {/* Parent Report Generator */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-lg font-medium text-neutral-900">Parent Report Generator</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-6">Create professional progress reports for parents and guardians.</p>

            <form onSubmit={generateParentReport} className="space-y-4">
              <div>
                <label htmlFor="student_name_report" className="block text-sm font-medium text-neutral-700">
                  Student Name *
                </label>
                <input
                  type="text"
                  id="student_name_report"
                  name="student_name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="e.g., Sarah Johnson"
                />
              </div>

              <div>
                <label htmlFor="subject_report" className="block text-sm font-medium text-neutral-700">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject_report"
                  name="subject"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="e.g., Mathematics"
                />
              </div>

              <div>
                <label htmlFor="lesson_date" className="block text-sm font-medium text-neutral-700">
                  Lesson Date *
                </label>
                <input
                  type="date"
                  id="lesson_date"
                  name="lesson_date"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>

              <div>
                <label htmlFor="lesson_content" className="block text-sm font-medium text-neutral-700">
                  Lesson Content Covered *
                </label>
                <textarea
                  id="lesson_content"
                  name="lesson_content"
                  required
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="What topics and activities were covered?"
                />
              </div>

              <div>
                <label htmlFor="student_performance" className="block text-sm font-medium text-neutral-700">
                  Student Performance *
                </label>
                <textarea
                  id="student_performance"
                  name="student_performance"
                  required
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="How did the student perform? What did they do well?"
                />
              </div>

              <div>
                <label htmlFor="areas_of_strength" className="block text-sm font-medium text-neutral-700">
                  Areas of Strength
                </label>
                <textarea
                  id="areas_of_strength"
                  name="areas_of_strength"
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="What are the student's strengths?"
                />
              </div>

              <div>
                <label htmlFor="areas_for_improvement" className="block text-sm font-medium text-neutral-700">
                  Areas for Improvement
                </label>
                <textarea
                  id="areas_for_improvement"
                  name="areas_for_improvement"
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="What areas need more work?"
                />
              </div>

              <div>
                <label htmlFor="homework_assigned" className="block text-sm font-medium text-neutral-700">
                  Homework Assigned
                </label>
                <textarea
                  id="homework_assigned"
                  name="homework_assigned"
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="What homework was given?"
                />
              </div>

              <div>
                <label htmlFor="next_lesson_focus" className="block text-sm font-medium text-neutral-700">
                  Next Lesson Focus
                </label>
                <textarea
                  id="next_lesson_focus"
                  name="next_lesson_focus"
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  placeholder="What will be covered in the next lesson?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-900"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generate Parent Report
                  </>
                )}
              </button>
            </form>

            {parentReport && (
              <div className="mt-6 p-4 bg-neutral-50 rounded-md">
                <h3 className="text-sm font-medium text-neutral-900 mb-2">Generated Parent Report:</h3>
                <div className="text-sm text-neutral-700 whitespace-pre-wrap">{parentReport}</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
