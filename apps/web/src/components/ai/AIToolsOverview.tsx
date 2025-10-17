import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { LessonPlan, FeedbackReport } from '@/types'

interface AIToolsOverviewProps {
  lessonPlans: LessonPlan[]
  feedbackReports: FeedbackReport[]
}

export function AIToolsOverview({ lessonPlans, feedbackReports }: AIToolsOverviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Recent Lesson Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Lesson Plans</span>
            <Badge variant="outline">{lessonPlans.length}</Badge>
          </CardTitle>
          <CardDescription>
            Your latest AI-generated lesson plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lessonPlans.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No lesson plans yet</p>
              <p className="text-gray-400 text-xs mt-1">Create your first AI lesson plan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessonPlans.slice(0, 3).map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{plan.topic}</h4>
                    <p className="text-sm text-gray-600">
                      {plan.student_level} • {formatDate(plan.created_at)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
              {lessonPlans.length > 3 && (
                <Button variant="outline" size="sm" className="w-full">
                  View All ({lessonPlans.length})
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Feedback Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Feedback Reports</span>
            <Badge variant="outline">{feedbackReports.length}</Badge>
          </CardTitle>
          <CardDescription>
            Your latest AI-generated feedback reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedbackReports.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No feedback reports yet</p>
              <p className="text-gray-400 text-xs mt-1">Generate your first AI feedback report</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbackReports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{report.session_topic}</h4>
                    <p className="text-sm text-gray-600">
                      {report.student_name || 'Student'} • {formatDate(report.created_at)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={report.status === 'shared' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
              {feedbackReports.length > 3 && (
                <Button variant="outline" size="sm" className="w-full">
                  View All ({feedbackReports.length})
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
