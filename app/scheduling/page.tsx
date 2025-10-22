'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
}

export default function Scheduling() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<'today' | 'week' | 'month'>('week')
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([])
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
        return
      }
      fetchLessons()
    }
    checkUser()
  }, [router, supabase.auth])

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons')
      const data = await response.json()
      if (response.ok) {
        setLessons(data.lessons)
        filterLessons(data.lessons, viewType, currentDate)
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterLessons = (lessonsData: Lesson[], type: 'today' | 'week' | 'month', date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    let filtered = lessonsData.filter(lesson => {
      const lessonDate = new Date(lesson.start_time)
      
      switch (type) {
        case 'today':
          return lessonDate.toDateString() === today.toDateString()
        case 'week':
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay() + 1) // Monday
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6) // Sunday
          return lessonDate >= weekStart && lessonDate <= weekEnd
        case 'month':
          return lessonDate.getMonth() === today.getMonth() && lessonDate.getFullYear() === today.getFullYear()
        default:
          return true
      }
    })
    
    setFilteredLessons(filtered)
  }

  const handleViewChange = (type: 'today' | 'week' | 'month') => {
    setViewType(type)
    filterLessons(lessons, type, currentDate)
  }

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    
    if (viewType === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7))
    } else if (viewType === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1))
    }
    
    setCurrentDate(newDate)
    filterLessons(lessons, viewType, newDate)
  }

  const getDateRange = () => {
    const now = new Date()
    
    if (viewType === 'today') {
      return now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } else if (viewType === 'week') {
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    } else {
      return currentDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
    }
  }

  const getCalendarDays = () => {
    if (viewType === 'today') {
      return [currentDate]
    } else if (viewType === 'week') {
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1)
      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(weekStart)
        day.setDate(weekStart.getDate() + i)
        return day
      })
    } else {
      // Month view - get all days in the month
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const days = []
      
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i))
      }
      return days
    }
  }

  const getLessonsForDay = (date: Date) => {
    return lessons.filter(lesson => {
      const lessonDate = new Date(lesson.start_time)
      return lessonDate.toDateString() === date.toDateString()
    })
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 0
    const start = new Date(startTime)
    const end = new Date(endTime)
    return Math.round((end.getTime() - start.getTime()) / 60000) // duration in minutes
  }

  const handleEditLesson = (lessonId: string) => {
    // Navigate to edit page
    router.push(`/scheduling/${lessonId}/edit`)
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      try {
        const response = await fetch(`/api/lessons/${lessonId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          // Refresh lessons
          fetchLessons()
        } else {
          alert('Failed to delete lesson')
        }
      } catch (error) {
        console.error('Error deleting lesson:', error)
        alert('Failed to delete lesson')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Scheduling</h1>
            <p className="text-neutral-600">Manage your lessons and schedule new sessions.</p>
          </div>
          <Link href="/scheduling/new" className="inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Schedule Lesson
          </Link>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-neutral-900 capitalize">
              {viewType === 'today' ? 'Today' : viewType === 'week' ? 'This Week' : 'This Month'}
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigateCalendar('prev')}
                className="p-2 text-neutral-400 hover:text-neutral-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm text-neutral-600">{getDateRange()}</span>
              <button 
                onClick={() => navigateCalendar('next')}
                className="p-2 text-neutral-400 hover:text-neutral-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Enhanced Calendar Grid */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            {viewType === 'week' && (
              <div className="grid grid-cols-8">
                {/* Time column */}
                <div className="border-r border-neutral-200 bg-neutral-50">
                  <div className="h-8 border-b border-neutral-200"></div>
                  {Array.from({ length: 12 }, (_, hour) => (
                    <div key={hour} className="h-8 border-b border-neutral-200 flex items-center justify-end pr-2">
                      <span className="text-xs text-neutral-500">
                        {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Days of the week */}
                {getCalendarDays().map((date, i) => {
                  const dayLessons = getLessonsForDay(date)
                  const isToday = date.toDateString() === new Date().toDateString()
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6 // Sunday or Saturday
                  const now = new Date()
                  const currentHour = now.getHours()
                  const currentMinute = now.getMinutes()
                  const currentTimePosition = ((currentHour * 60 + currentMinute) / (24 * 60)) * 100
                  
                  return (
                    <div key={i} className="border-r border-neutral-200 last:border-r-0">
                      {/* Day header */}
                      <div className={`h-8 border-b border-neutral-200 flex items-center justify-center ${
                        isToday ? 'bg-blue-50' : isWeekend ? 'bg-orange-50' : 'bg-white'
                      }`}>
                        <div className="text-center">
                          <div className={`text-sm font-semibold ${
                            isToday ? 'text-blue-900' : isWeekend ? 'text-orange-900' : 'text-neutral-900'
                          }`}>
                            {date.toLocaleDateString('en-US', { weekday: 'short' })} {date.getDate()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Time slots - compact view */}
                      <div className="relative">
                        {/* Current time line for today */}
                        {isToday && (
                          <div 
                            className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                            style={{ top: `${currentTimePosition}%` }}
                          >
                            <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                        )}
                        
                        {Array.from({ length: 12 }, (_, hour) => (
                          <div key={hour} className="h-8 border-b border-neutral-100 relative">
                            {/* Hour markers */}
                            <div className="absolute left-0 right-0 top-0 h-px bg-neutral-200"></div>
                            
                            {/* Lessons for this hour */}
                            {dayLessons
                              .filter(lesson => {
                                const lessonHour = new Date(lesson.start_time).getHours()
                                return lessonHour === hour
                              })
                              .map((lesson, lessonIndex) => {
                                const lessonStart = new Date(lesson.start_time)
                                const lessonMinute = lessonStart.getMinutes()
                                const lessonDuration = calculateDuration(lesson.start_time, lesson.end_time)
                                const lessonHeight = Math.max((lessonDuration / 60) * 2, 0.5) // 2rem per hour
                                
                                return (
                                  <div
                                    key={lessonIndex}
                                    className="absolute left-1 right-1 bg-blue-100 border border-blue-200 rounded text-xs p-0.5 z-20"
                                    style={{
                                      top: `${(lessonMinute / 60) * 2}rem`,
                                      height: `${lessonHeight}rem`
                                    }}
                                  >
                                    <div className="font-medium text-blue-900 truncate text-xs">
                                      {lesson.student_name || 'Student'}
                                    </div>
                                    <div className="text-blue-700 text-xs">
                                      {formatTime(lesson.start_time)}
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            
            {viewType === 'today' && (
              <div className="grid grid-cols-2">
                {/* Time column */}
                <div className="border-r border-neutral-200 bg-neutral-50">
                  <div className="h-8 border-b border-neutral-200"></div>
                  {Array.from({ length: 12 }, (_, hour) => (
                    <div key={hour} className="h-8 border-b border-neutral-200 flex items-center justify-end pr-2">
                      <span className="text-xs text-neutral-500">
                        {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Today's schedule */}
                <div className="relative">
                  {(() => {
                    const today = getCalendarDays()[0]
                    const dayLessons = getLessonsForDay(today)
                    const now = new Date()
                    const currentHour = now.getHours()
                    const currentMinute = now.getMinutes()
                    const currentTimePosition = ((currentHour * 60 + currentMinute) / (24 * 60)) * 100
                    
                    return (
                      <>
                        {/* Current time line */}
                        <div 
                          className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                          style={{ top: `${currentTimePosition}%` }}
                        >
                          <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        
                        {Array.from({ length: 12 }, (_, hour) => (
                          <div key={hour} className="h-8 border-b border-neutral-100 relative">
                            {/* Hour markers */}
                            <div className="absolute left-0 right-0 top-0 h-px bg-neutral-200"></div>
                            
                            {/* Lessons for this hour */}
                            {dayLessons
                              .filter(lesson => {
                                const lessonHour = new Date(lesson.start_time).getHours()
                                return lessonHour === hour
                              })
                              .map((lesson, lessonIndex) => {
                                const lessonStart = new Date(lesson.start_time)
                                const lessonMinute = lessonStart.getMinutes()
                                const lessonDuration = calculateDuration(lesson.start_time, lesson.end_time)
                                const lessonHeight = Math.max((lessonDuration / 60) * 2, 0.5)
                                
                                return (
                                  <div
                                    key={lessonIndex}
                                    className="absolute left-1 right-1 bg-blue-100 border border-blue-200 rounded text-xs p-0.5 z-20"
                                    style={{
                                      top: `${(lessonMinute / 60) * 2}rem`,
                                      height: `${lessonHeight}rem`
                                    }}
                                  >
                                    <div className="font-medium text-blue-900 truncate text-xs">
                                      {lesson.student_name || 'Student'}
                                    </div>
                                    <div className="text-blue-700 text-xs">
                                      {formatTime(lesson.start_time)}
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                        ))}
                      </>
                    )
                  })()}
                </div>
              </div>
            )}
            
            {viewType === 'month' && (
              <div className="grid grid-cols-7 gap-1 p-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-neutral-500 py-2">
                    {day}
                  </div>
                ))}
                {getCalendarDays().map((date, i) => {
                  const dayLessons = getLessonsForDay(date)
                  const isToday = date.toDateString() === new Date().toDateString()
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6 // Sunday or Saturday
                  
                  return (
                    <div 
                      key={i} 
                      className={`h-20 border border-neutral-200 rounded-lg p-2 ${
                        isToday ? 'bg-blue-50 border-blue-200' : isWeekend ? 'bg-orange-50 border-orange-200' : ''
                      }`}
                    >
                      <div className={`text-sm font-medium ${
                        isToday ? 'text-blue-900' : isWeekend ? 'text-orange-900' : 'text-neutral-900'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {dayLessons.slice(0, 2).map((lesson, lessonIndex) => (
                          <div 
                            key={lessonIndex}
                            className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                            title={`${lesson.student_name || 'Student'} - ${lesson.subject} (${formatTime(lesson.start_time)})`}
                          >
                            {lesson.student_name || 'Student'}
                          </div>
                        ))}
                        {dayLessons.length > 2 && (
                          <div className="text-xs text-neutral-500">
                            +{dayLessons.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Lessons */}
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
            <h2 className="text-lg font-medium text-neutral-900">Upcoming Lessons</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleViewChange('today')}
                className={`px-3 py-1 text-sm rounded-md transition ${
                  viewType === 'today' 
                    ? 'bg-neutral-900 text-white' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                Today
              </button>
              <button 
                onClick={() => handleViewChange('week')}
                className={`px-3 py-1 text-sm rounded-md transition ${
                  viewType === 'week' 
                    ? 'bg-neutral-900 text-white' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                This Week
              </button>
              <button 
                onClick={() => handleViewChange('month')}
                className={`px-3 py-1 text-sm rounded-md transition ${
                  viewType === 'month' 
                    ? 'bg-neutral-900 text-white' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          <div className="divide-y divide-neutral-200">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <div key={lesson.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-neutral-600">
                            {lesson.student_name?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-neutral-900">{lesson.title}</h3>
                          <p className="text-sm text-neutral-600">
                            {lesson.student_name || 'Unknown Student'} • {lesson.subject}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-neutral-900">
                          {formatDate(lesson.start_time)}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          lesson.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          lesson.status === 'completed' ? 'bg-green-100 text-green-800' :
                          lesson.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lesson.status}
                        </span>
                        {lesson.price && (
                          <span className="text-sm font-medium text-neutral-900">
                            ${lesson.price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEditLesson(lesson.id)}
                          className="p-1 text-neutral-400 hover:text-neutral-600"
                          title="Edit lesson"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="p-1 text-neutral-400 hover:text-red-600"
                          title="Delete lesson"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-neutral-900">
                  No lessons {viewType === 'today' ? 'today' : viewType === 'week' ? 'this week' : 'this month'}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">Get started by scheduling your first lesson.</p>
                <div className="mt-6">
                  <Link href="/scheduling/new" className="inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Schedule Lesson
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
