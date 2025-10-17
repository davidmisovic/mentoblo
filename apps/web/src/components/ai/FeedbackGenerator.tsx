'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFeedbackReport } from '@/lib/actions/ai'
import type { FeedbackPrompt } from '@/types'

export function FeedbackGenerator() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState<FeedbackPrompt>({
    sessionTopic: '',
    studentPerformance: '',
    strengths: '',
    areasForImprovement: '',
    sessionNotes: '',
    studentName: '',
    studentAge: undefined
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const result = await createFeedbackReport(formData)
      if (result.success) {
        setMessage('Feedback report generated successfully!')
        // Reset form
        setFormData({
          sessionTopic: '',
          studentPerformance: '',
          strengths: '',
          areasForImprovement: '',
          sessionNotes: '',
          studentName: '',
          studentAge: undefined
        })
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to generate feedback report')
    }

    setLoading(false)
  }

  const handleInputChange = (field: keyof FeedbackPrompt, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sessionTopic">Session Topic *</Label>
          <Input
            id="sessionTopic"
            value={formData.sessionTopic}
            onChange={(e) => handleInputChange('sessionTopic', e.target.value)}
            placeholder="e.g., Introduction to Fractions"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentName">Student Name</Label>
          <Input
            id="studentName"
            value={formData.studentName}
            onChange={(e) => handleInputChange('studentName', e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="studentPerformance">Student Performance *</Label>
        <textarea
          id="studentPerformance"
          value={formData.studentPerformance}
          onChange={(e) => handleInputChange('studentPerformance', e.target.value)}
          placeholder="Describe how the student performed during the session..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="strengths">Strengths Observed</Label>
          <textarea
            id="strengths"
            value={formData.strengths}
            onChange={(e) => handleInputChange('strengths', e.target.value)}
            placeholder="What did the student do well?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="areasForImprovement">Areas for Improvement</Label>
          <textarea
            id="areasForImprovement"
            value={formData.areasForImprovement}
            onChange={(e) => handleInputChange('areasForImprovement', e.target.value)}
            placeholder="What needs more work?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sessionNotes">Additional Session Notes</Label>
        <textarea
          id="sessionNotes"
          value={formData.sessionNotes}
          onChange={(e) => handleInputChange('sessionNotes', e.target.value)}
          placeholder="Any additional observations or notes about the session..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="studentAge">Student Age</Label>
        <Input
          id="studentAge"
          type="number"
          value={formData.studentAge || ''}
          onChange={(e) => {
            const value = e.target.value;
            handleInputChange('studentAge', value === '' ? undefined : parseInt(value));
          }}
          placeholder="Optional"
          min="5"
          max="18"
        />
      </div>

      {message && (
        <div className={`p-3 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-600' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={loading || !formData.sessionTopic || !formData.studentPerformance}
        className="w-full"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Generating Feedback...
          </div>
        ) : (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Generate AI Feedback Report
          </div>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        AI will create a detailed, constructive feedback report for the student and parents.
      </div>
    </form>
  )
}
