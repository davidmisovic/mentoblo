import { GoogleGenerativeAI } from '@google/generative-ai'
import type { LessonPlanPrompt, FeedbackPrompt, AILessonPlan, AIFeedbackReport } from '@/types'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function generateLessonPlan(prompt: LessonPlanPrompt): Promise<AILessonPlan> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const systemPrompt = `You are an expert educational consultant and lesson planner. Create comprehensive, engaging lesson plans that are age-appropriate and pedagogically sound.`

  const userPrompt = `Create a detailed lesson plan for the following:

Topic: ${prompt.topic}
Student Level: ${prompt.studentLevel}
Duration: ${prompt.duration || 60} minutes
${prompt.objectives ? `Learning Objectives: ${prompt.objectives}` : ''}
${prompt.ageGroup ? `Age Group: ${prompt.ageGroup}` : ''}
${prompt.subject ? `Subject: ${prompt.subject}` : ''}

Please provide a structured lesson plan that includes:
1. Clear learning objectives
2. Required materials
3. Step-by-step activities with time allocations
4. Assessment methods
5. Optional homework assignments
6. Additional notes for the tutor

Format the response as a structured lesson plan that a tutor can follow directly.`

  try {
    const result = await model.generateContent([systemPrompt, userPrompt])
    const response = await result.response
    const text = response.text()

    // Parse the AI response into structured format
    return parseLessonPlanResponse(text)
  } catch (error) {
    console.error('Error generating lesson plan:', error)
    throw new Error('Failed to generate lesson plan')
  }
}

export async function generateFeedbackReport(prompt: FeedbackPrompt): Promise<AIFeedbackReport> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const systemPrompt = `You are an experienced educational consultant who provides constructive, encouraging feedback to students and parents. Create detailed, personalized feedback reports that highlight strengths, identify areas for improvement, and provide actionable recommendations.`

  const userPrompt = `Create a comprehensive feedback report for a tutoring session:

Session Topic: ${prompt.sessionTopic}
Student Performance: ${prompt.studentPerformance}
${prompt.strengths ? `Strengths Observed: ${prompt.strengths}` : ''}
${prompt.areasForImprovement ? `Areas for Improvement: ${prompt.areasForImprovement}` : ''}
${prompt.sessionNotes ? `Additional Notes: ${prompt.sessionNotes}` : ''}
${prompt.studentName ? `Student Name: ${prompt.studentName}` : ''}
${prompt.studentAge ? `Student Age: ${prompt.studentAge}` : ''}

Please provide:
1. A brief summary of the session
2. Key strengths demonstrated by the student
3. Specific areas that need improvement
4. Actionable recommendations for continued learning
5. Next steps for the student
6. Overall progress assessment (excellent/good/needs_improvement)

Make the feedback encouraging, specific, and constructive. Focus on growth and learning.`

  try {
    const result = await model.generateContent([systemPrompt, userPrompt])
    const response = await result.response
    const text = response.text()

    // Parse the AI response into structured format
    return parseFeedbackResponse(text)
  } catch (error) {
    console.error('Error generating feedback report:', error)
    throw new Error('Failed to generate feedback report')
  }
}

function parseLessonPlanResponse(text: string): AILessonPlan {
  // This is a simplified parser - in production, you might want more sophisticated parsing
  const lines = text.split('\n').filter(line => line.trim())
  
  const lessonPlan: AILessonPlan = {
    title: extractSection(lines, 'title', 'lesson plan') || 'Generated Lesson Plan',
    objectives: extractList(lines, 'objectives', 'learning objectives'),
    materials: extractList(lines, 'materials', 'required materials'),
    activities: extractActivities(lines),
    assessment: extractSection(lines, 'assessment', 'assessment methods') || 'Formative assessment through observation and participation',
    homework: extractSection(lines, 'homework', 'homework'),
    notes: extractSection(lines, 'notes', 'additional notes')
  }

  return lessonPlan
}

function parseFeedbackResponse(text: string): AIFeedbackReport {
  const lines = text.split('\n').filter(line => line.trim())
  
  const feedback: AIFeedbackReport = {
    summary: extractSection(lines, 'summary', 'session summary') || 'Session completed successfully',
    strengths: extractList(lines, 'strengths', 'key strengths'),
    areasForImprovement: extractList(lines, 'improvement', 'areas for improvement'),
    recommendations: extractList(lines, 'recommendations', 'recommendations'),
    nextSteps: extractList(lines, 'next steps', 'next steps'),
    overallProgress: determineProgress(text)
  }

  return feedback
}

function extractSection(lines: string[], ...keywords: string[]): string | null {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase()
    if (keywords.some(keyword => line.includes(keyword))) {
      // Return the next few lines as the section content
      const content = lines.slice(i + 1, i + 4).join(' ').trim()
      return content || null
    }
  }
  return null
}

function extractList(lines: string[], ...keywords: string[]): string[] {
  const items: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase()
    if (keywords.some(keyword => line.includes(keyword))) {
      // Look for list items in the next few lines
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const item = lines[j].trim()
        if (item && (item.startsWith('-') || item.startsWith('•') || item.startsWith('*') || /^\d+\./.test(item))) {
          items.push(item.replace(/^[-•*]\s*|\d+\.\s*/, '').trim())
        }
      }
      break
    }
  }
  
  return items
}

function extractActivities(lines: string[]): AILessonPlan['activities'] {
  const activities: AILessonPlan['activities'] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase()
    if (line.includes('activity') || line.includes('exercise')) {
      // Look for activity descriptions
      for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
        const activityLine = lines[j].trim()
        if (activityLine && activityLine.length > 10) {
          activities.push({
            name: activityLine.split(':')[0] || `Activity ${activities.length + 1}`,
            description: activityLine.split(':').slice(1).join(':').trim() || activityLine,
            duration: 15 // Default duration
          })
        }
      }
      break
    }
  }
  
  return activities
}

function determineProgress(text: string): 'excellent' | 'good' | 'needs_improvement' {
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes('excellent') || lowerText.includes('outstanding') || lowerText.includes('exceptional')) {
    return 'excellent'
  } else if (lowerText.includes('needs improvement') || lowerText.includes('struggling') || lowerText.includes('difficult')) {
    return 'needs_improvement'
  } else {
    return 'good'
  }
}
