import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthButton } from '@/components/auth/auth-button'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { UpcomingSessionList } from '@/components/dashboard/UpcomingSessionList'
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  // Get upcoming sessions (next 7 days)
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  
  const { data: upcomingBookings } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles!bookings_student_id_fkey (
        full_name,
        avatar_url
      ),
      payments (
        id,
        status,
        amount_cents,
        tutor_earnings_cents
      )
    `)
    .eq('tutor_id', user.id)
    .in('status', ['confirmed', 'completed'])
    .gte('start_time', new Date().toISOString())
    .lte('start_time', sevenDaysFromNow.toISOString())
    .order('start_time')

  // Get new students this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: newStudents } = await supabase
    .from('bookings')
    .select('student_id')
    .eq('tutor_id', user.id)
    .gte('created_at', startOfMonth.toISOString())
    .not('student_id', 'is', null)

  const uniqueNewStudents = new Set(newStudents?.map(b => b.student_id) || []).size

  // Get monthly revenue
  const { data: monthlyPayments } = await supabase
    .from('payments')
    .select('tutor_earnings_cents')
    .eq('tutor_id', user.id)
    .eq('status', 'succeeded')
    .gte('created_at', startOfMonth.toISOString())

  const monthlyRevenue = monthlyPayments?.reduce((sum, payment) => sum + payment.tutor_earnings_cents, 0) || 0

  // Get recent activity data
  const { data: recentBookings } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles!bookings_student_id_fkey (
        full_name
      )
    `)
    .eq('tutor_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentLessonPlans } = await supabase
    .from('lesson_plans')
    .select('*')
    .eq('tutor_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: recentReports } = await supabase
    .from('student_reports')
    .select('*')
    .eq('tutor_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  // Get total stats
  const { data: totalBookings } = await supabase
    .from('bookings')
    .select('id', { count: 'exact' })
    .eq('tutor_id', user.id)

  const { data: completedBookings } = await supabase
    .from('bookings')
    .select('id', { count: 'exact' })
    .eq('tutor_id', user.id)
    .eq('status', 'completed')

  const { data: totalEarnings } = await supabase
    .from('payments')
    .select('tutor_earnings_cents')
    .eq('tutor_id', user.id)
    .eq('status', 'succeeded')

  const totalEarningsAmount = totalEarnings?.reduce((sum, payment) => sum + payment.tutor_earnings_cents, 0) || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile.full_name || 'Tutor'}!
          </h1>
          <p className="text-lg text-gray-600">
            Here&apos;s what&apos;s happening with your tutoring business today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KpiCard
            title="Upcoming Sessions (Next 7 Days)"
            value={upcomingBookings?.length || 0}
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            color="bg-blue-100"
            textColor="text-blue-600"
          />
            <KpiCard
              title="New Students (This Month)"
              value={uniqueNewStudents}
              icon={
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
              color="bg-green-100"
              textColor="text-green-600"
            />
            <KpiCard
              title="Monthly Revenue"
              value={`$${(monthlyRevenue / 100).toFixed(2)}`}
              icon={
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
              color="bg-yellow-100"
              textColor="text-yellow-600"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Sessions */}
              <UpcomingSessionList bookings={upcomingBookings || []} />

              {/* Recent Activity Feed */}
              <RecentActivityFeed
                recentBookings={recentBookings || []}
                recentLessonPlans={recentLessonPlans || []}
                recentReports={recentReports || []}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <QuickActions userRole={profile.user_role} />

              {/* Dashboard Overview */}
              <DashboardOverview
                profile={profile}
                totalBookings={totalBookings?.length || 0}
                completedSessions={completedBookings?.length || 0}
                totalEarnings={totalEarningsAmount}
              />
            </div>
          </div>
        </div>
    </div>
  )
}