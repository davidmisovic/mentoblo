'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createLessonPlan } from '@/lib/actions/ai'
import { showToast } from '@/lib/toast'
import type { StudentLevel, LessonPlanPrompt } from '@/types'
import ReactMarkdown from 'react-markdown'

const STUDENT_LEVELS: { value: StudentLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
]

export function LessonPlanner() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [generatedPlan, setGeneratedPlan] = useState('')
  const [formData, setFormData] = useState<LessonPlanPrompt>({
    topic: '',
    studentLevel: 'intermediate',
    objectives: '',
    duration: 60,
    ageGroup: '',
    subject: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const result = await createLessonPlan(formData)
      if (result.success) {
        showToast.success('Lesson plan generated!', 'Your AI-generated lesson plan is ready.')
        setMessage('Lesson plan created successfully!')
        setGeneratedPlan(result.generatedText || '')
        // Reset form
        setFormData({
          topic: '',
          studentLevel: 'intermediate',
          objectives: '',
          duration: 60,
          ageGroup: '',
          subject: ''
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create lesson plan'
      setMessage(errorMessage)
      showToast.error('Failed to generate lesson plan', errorMessage)
    }

    setLoading(false)
  }

  const handleInputChange = (field: keyof LessonPlanPrompt, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Lesson Topic *</Label>
          <Input
            id="topic"
            value={formData.topic}
            onChange={(e) => handleInputChange('topic', e.target.value)}
            placeholder="e.g., Introduction to Algebra"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentLevel">Student Level *</Label>
          <select
            id="studentLevel"
            value={formData.studentLevel}
            onChange={(e) => handleInputChange('studentLevel', e.target.value as StudentLevel)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {STUDENT_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 60)}
            min="15"
            max="180"
            step="15"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ageGroup">Age Group</Label>
          <Input
            id="ageGroup"
            value={formData.ageGroup}
            onChange={(e) => handleInputChange('ageGroup', e.target.value)}
            placeholder="e.g., 12-14 years"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          placeholder="e.g., Mathematics, Science, English"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="objectives">Learning Objectives</Label>
        <textarea
          id="objectives"
          value={formData.objectives}
          onChange={(e) => handleInputChange('objectives', e.target.value)}
          placeholder="Describe what students should learn from this lesson..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
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
        disabled={loading || !formData.topic}
        className="w-full"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Generating Lesson Plan...
          </div>
        ) : (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate AI Lesson Plan
          </div>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        AI will create a comprehensive lesson plan with activities, materials, and assessment methods.
      </div>
    </form>

    {/* Generated Lesson Plan Display */}
    {generatedPlan && (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Generated Lesson Plan
          </CardTitle>
          <CardDescription>
            Your AI-generated lesson plan is ready! You can copy this content or save it for future reference.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700">
            <ReactMarkdown>{generatedPlan}</ReactMarkdown>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => navigator.clipboard.writeText(generatedPlan)}
              className="w-full"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Lesson Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    )}
  </div>
  )
}
