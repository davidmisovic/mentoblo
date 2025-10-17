import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthButton } from '@/components/auth/auth-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LessonPlanner } from '@/components/ai/LessonPlanner'
import { FeedbackGenerator } from '@/components/ai/FeedbackGenerator'
import { AIToolsOverview } from '@/components/ai/AIToolsOverview'

export default async function AIToolsPage() {
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

  // Redirect if not a tutor
  if (profile?.user_role !== 'tutor') {
    redirect('/dashboard')
  }

  // Get recent lesson plans and feedback reports
  const { data: lessonPlans } = await supabase
    .from('lesson_plans')
    .select('*')
    .eq('tutor_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: feedbackReports } = await supabase
    .from('feedback_reports')
    .select('*')
    .eq('tutor_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Mentoblo</span>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI Copilot Tools
            </h1>
            <p className="text-lg text-gray-600">
              Leverage AI to create engaging lesson plans and generate detailed feedback reports for your students.
            </p>
          </div>

          {/* AI Tools Overview */}
          <AIToolsOverview 
            lessonPlans={lessonPlans || []}
            feedbackReports={feedbackReports || []}
          />

          {/* Main AI Tools */}
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* Lesson Planner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  AI Lesson Planner
                </CardTitle>
                <CardDescription>
                  Generate comprehensive, personalized lesson plans for any topic and student level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LessonPlanner />
              </CardContent>
            </Card>

            {/* Feedback Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  AI Feedback Generator
                </CardTitle>
                <CardDescription>
                  Create detailed, constructive feedback reports for students and parents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeedbackGenerator />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
