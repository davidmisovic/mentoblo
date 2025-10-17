import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthButton } from '@/components/auth/auth-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LessonPlanner } from '@/components/ai/LessonPlanner'

export default async function LessonPlannerPage() {
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

  // Get recent lesson plans for this tutor
  const { data: lessonPlans } = await supabase
    .from('lesson_plans')
    .select('*')
    .eq('tutor_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI Lesson Planner
            </h1>
            <p className="text-lg text-gray-600">
              Generate comprehensive, personalized lesson plans for any topic and student level using AI.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Lesson Plan Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  Create New Lesson Plan
                </CardTitle>
                <CardDescription>
                  Fill out the form below to generate a comprehensive lesson plan with activities, materials, and assessment methods.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LessonPlanner />
              </CardContent>
            </Card>

            {/* Recent Lesson Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  Recent Lesson Plans
                </CardTitle>
                <CardDescription>
                  Your latest AI-generated lesson plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lessonPlans && lessonPlans.length > 0 ? (
                  <div className="space-y-3">
                    {lessonPlans.slice(0, 5).map((plan) => (
                      <div key={plan.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <h4 className="font-medium text-gray-900 mb-1">{plan.topic}</h4>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{plan.student_level}</span>
                          <span>{new Date(plan.created_at).toLocaleDateString()}</span>
                        </div>
                        {plan.objectives && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {plan.objectives}
                          </p>
                        )}
                      </div>
                    ))}
                    {lessonPlans.length > 5 && (
                      <div className="text-center pt-2">
                        <span className="text-sm text-gray-500">
                          And {lessonPlans.length - 5} more lesson plans...
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No lesson plans yet</p>
                    <p className="text-gray-400 text-xs mt-1">Create your first AI lesson plan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
