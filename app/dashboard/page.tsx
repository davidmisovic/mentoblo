'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DashboardStats {
  monthlyRevenue: number
  newLeads: number
  upcomingLessons: number
  growthPercentage?: number
  conversionRate?: number
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    studentName?: string
  }>
  monthlyRevenueData?: Array<{
    month: string
    revenue: number
  }>
}

interface Invoice {
  id: string
  total: number
  status: string
  created_at: string
  updated_at?: string
  student_name?: string
}

interface Lesson {
  id: string
  student_name: string
  subject: string
  start_time: string
  duration: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    monthlyRevenue: 0,
    newLeads: 0,
    upcomingLessons: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [hasRealData, setHasRealData] = useState(false)
  const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>([])
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
        return
      }
      await fetchDashboardData()
      setLoading(false)
    }
    checkUser()
  }, [router])

  // Auto-refresh timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasRealData) {
        fetchDashboardData()
      }
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [hasRealData])

  // Time calculation function
  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}d ago`
    } else {
      const weeks = Math.floor(diffInSeconds / 604800)
      return `${weeks}w ago`
    }
  }

  // Chart data generation functions
  const generateMonthlyRevenueData = (invoices: Invoice[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentYear = new Date().getFullYear()
    
    return months.map((month, index) => {
      const monthRevenue = invoices
        .filter(invoice => {
          const invoiceDate = new Date(invoice.created_at)
          return invoiceDate.getMonth() === index && 
                 invoiceDate.getFullYear() === currentYear &&
                 invoice.status === 'paid'
        })
        .reduce((sum, invoice) => sum + invoice.total, 0)
      
      return { month, revenue: monthRevenue }
    })
  }


  const fetchDashboardData = async () => {
    try {
      // Fetch real data from APIs
      const [invoicesResponse, lessonsResponse] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/lessons')
      ])

      const invoicesData = await invoicesResponse.json()
      const lessonsData = await lessonsResponse.json()

      // Calculate real metrics
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      
      const monthlyRevenue = invoicesData.invoices?.filter((invoice: Invoice) => {
        const invoiceDate = new Date(invoice.created_at)
        return invoiceDate.getMonth() === currentMonth && 
               invoiceDate.getFullYear() === currentYear &&
               invoice.status === 'paid'
      }).reduce((sum: number, invoice: Invoice) => sum + invoice.total, 0) || 0

      const lastMonthRevenue = invoicesData.invoices?.filter((invoice: Invoice) => {
        const invoiceDate = new Date(invoice.created_at)
        return invoiceDate.getMonth() === lastMonth && 
               invoiceDate.getFullYear() === lastMonthYear &&
               invoice.status === 'paid'
      }).reduce((sum: number, invoice: Invoice) => sum + invoice.total, 0) || 0

      // Calculate growth percentage
      const growthPercentage = lastMonthRevenue > 0 
        ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
        : monthlyRevenue > 0 ? 100 : 0

      console.log('Dashboard data:', {
        invoices: invoicesData.invoices,
        monthlyRevenue,
        lastMonthRevenue,
        growthPercentage,
        currentMonth,
        currentYear
      })

      const upcomingLessons = lessonsData.lessons?.filter((lesson: Lesson) => {
        const lessonDate = new Date(lesson.start_time)
        return lessonDate >= new Date()
      }).slice(0, 3) || []

      // Check if we have real data
      const hasInvoices = invoicesData.invoices?.length > 0
      const hasLessons = lessonsData.lessons?.length > 0

      if (hasInvoices || hasLessons) {
        setHasRealData(true)
        
        // Create recent activity from real data
        const recentActivity: Array<{
          id: string
          type: string
          description: string
          timestamp: string
          studentName?: string
        }> = []
        
        // Add recent paid invoices as payment activities
        const recentPaidInvoices = invoicesData.invoices
          ?.filter((invoice: Invoice) => invoice.status === 'paid')
          ?.sort((a: Invoice, b: Invoice) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
          ?.slice(0, 3) || []

        recentPaidInvoices.forEach((invoice: Invoice, index: number) => {
          const timeAgo = getTimeAgo(new Date(invoice.updated_at || invoice.created_at))
          recentActivity.push({
            id: `payment-${invoice.id}`,
            type: 'payment',
            description: `Payment received • $${invoice.total.toFixed(2)}`,
            timestamp: timeAgo,
            studentName: invoice.student_name
          })
        })

        // Add recent sent invoices
        const recentSentInvoices = invoicesData.invoices
          ?.filter((invoice: Invoice) => invoice.status === 'sent')
          ?.sort((a: Invoice, b: Invoice) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          ?.slice(0, 2) || []

        recentSentInvoices.forEach((invoice: Invoice, index: number) => {
          const timeAgo = getTimeAgo(new Date(invoice.created_at))
          recentActivity.push({
            id: `invoice-${invoice.id}`,
            type: 'invoice',
            description: `Invoice sent • ${invoice.invoice_number}`,
            timestamp: timeAgo
          })
        })

        // Calculate conversion rate (simplified: paid invoices / total invoices)
        const totalInvoices = invoicesData.invoices?.length || 0
        const paidInvoices = invoicesData.invoices?.filter((invoice: Invoice) => invoice.status === 'paid').length || 0
        const conversionRate = totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0

        // Generate chart data
        const monthlyRevenueData = generateMonthlyRevenueData(invoicesData.invoices || [])

        setStats({
          monthlyRevenue,
          newLeads: 0, // TODO: Implement leads tracking
          upcomingLessons: upcomingLessons.length,
          growthPercentage,
          conversionRate,
          monthlyRevenueData,
          recentActivity: recentActivity.length > 0 ? recentActivity : [
            {
              id: '1',
              type: 'payment',
              description: `Payment received • $${monthlyRevenue.toFixed(2)}`,
              timestamp: '2m ago'
            }
          ]
        })
        setUpcomingLessons(upcomingLessons)
      } else {
        // Show sample data with transparency
        setStats({
          monthlyRevenue: 2840,
          newLeads: 19,
          upcomingLessons: 7,
          growthPercentage: 14,
          conversionRate: 42,
          recentActivity: [
            {
              id: '1',
              type: 'payment',
              description: 'Payment received • $60',
              timestamp: '2m ago',
              studentName: 'Sarah'
            },
            {
              id: '2',
              type: 'lead',
              description: 'New lead booked consultation',
              timestamp: '15m ago'
            },
            {
              id: '3',
              type: 'invoice',
              description: 'Invoice sent • Lesson #182',
              timestamp: '1h ago'
            }
          ]
        })
        setUpcomingLessons([
          {
            id: '1',
            student_name: 'Peter',
            subject: 'English B1',
            start_time: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
            duration: 45
          },
          {
            id: '2',
            student_name: 'Sarah',
            subject: 'Math Advanced',
            start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration: 60
          },
          {
            id: '3',
            student_name: 'Marco',
            subject: 'Physics',
            start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            duration: 90
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Fallback to sample data
      setStats({
        monthlyRevenue: 2840,
        newLeads: 19,
        upcomingLessons: 7,
        recentActivity: [
          {
            id: '1',
            type: 'payment',
            description: 'Payment received • $60',
            timestamp: '2m ago'
          },
          {
            id: '2',
            type: 'lead',
            description: 'New lead booked consultation',
            timestamp: '15m ago'
          },
          {
            id: '3',
            type: 'invoice',
            description: 'Invoice sent • Lesson #182',
            timestamp: '1h ago'
          }
        ]
      })
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
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600">Welcome back! Here's what's happening with your tutoring business.</p>
          {!hasRealData && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">Sample Data Display</p>
                  <p className="text-sm text-blue-700 mt-1">
                    This dashboard shows sample data to demonstrate how it will look. 
                    Create your first invoice or lesson to see real data here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">This month</p>
                <p className="text-2xl font-semibold text-neutral-900">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className={`text-sm inline-flex items-center gap-1 ${stats.growthPercentage >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  {stats.growthPercentage >= 0 ? '+' : ''}{stats.growthPercentage || 0}%
                </p>
              </div>
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">New leads</p>
                <p className="text-2xl font-semibold text-neutral-900">{stats.newLeads}</p>
                <p className="text-sm text-neutral-600">Conversion {stats.conversionRate || 0}%</p>
              </div>
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Upcoming</p>
                <p className="text-2xl font-semibold text-neutral-900">{stats.upcomingLessons} lessons</p>
                <p className="text-sm text-neutral-600">Next in 45m</p>
              </div>
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Total Invoices Card */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Invoices</p>
                <p className="text-2xl font-semibold text-neutral-900">{stats.invoiceStatusData?.reduce((sum, item) => sum + item.count, 0) || 0}</p>
                <p className="text-sm text-neutral-600">All time</p>
              </div>
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        {hasRealData && stats.monthlyRevenueData && stats.monthlyRevenueData.length > 0 && (
          <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Monthly Revenue Trend - {new Date().getFullYear()}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium text-neutral-700">Recent activity</span>
                </div>
                <button 
                  onClick={() => {
                    fetchDashboardData()
                    // Force re-render to update timestamps
                    setTimeout(() => {
                      window.location.reload()
                    }, 100)
                  }}
                  className="text-xs text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
              <div className="divide-y divide-neutral-200">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                        {activity.type === 'payment' && (
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        )}
                        {activity.type === 'lead' && (
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        )}
                        {activity.type === 'invoice' && (
                          <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-neutral-900">{activity.description}</p>
                        <p className="text-xs text-neutral-600">
                          {activity.type === 'payment' && `From ${activity.studentName || 'Student'}'s parent`}
                          {activity.type === 'lead' && 'Marco, Tuesday 10:00'}
                          {activity.type === 'invoice' && 'Peter • English B1'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-500">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/students/new" className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Student
                </Link>
                <Link href="/scheduling/new" className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Lesson
                </Link>
                <Link href="/invoicing/new" className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Create Invoice
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-4">Upcoming Lessons</h3>
              <div className="space-y-3">
                {upcomingLessons.length > 0 ? (
                  upcomingLessons.map((lesson) => {
                    const lessonDate = new Date(lesson.start_time)
                    const isToday = lessonDate.toDateString() === new Date().toDateString()
                    const isTomorrow = lessonDate.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString()
                    
                    let timeDisplay = ''
                    if (isToday) {
                      timeDisplay = `Today ${lessonDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    } else if (isTomorrow) {
                      timeDisplay = `Tomorrow ${lessonDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    } else {
                      timeDisplay = lessonDate.toLocaleDateString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' })
                    }

                    const durationDisplay = lesson.duration >= 60 
                      ? `${Math.floor(lesson.duration / 60)}h ${lesson.duration % 60}m`.replace('0m', '').trim()
                      : `${lesson.duration}m`

                    return (
                      <div key={lesson.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{lesson.subject}</p>
                          <p className="text-xs text-neutral-600">{lesson.student_name} • {timeDisplay}</p>
                          <p className="text-xs text-neutral-400">{getTimeAgo(new Date(lesson.start_time))}</p>
                        </div>
                        <span className="text-xs text-neutral-500">{durationDisplay}</span>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-neutral-500">No upcoming lessons</p>
                    <Link href="/scheduling/new" className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block">
                      Schedule your first lesson
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
