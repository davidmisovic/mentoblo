import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyAej261SLcTkYxVvYaM6FQt-DSah8ixffE')
const supabaseUrl = 'https://qnokhlujbcizmarngbhv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFub2tobHVqYmNpem1hcm5nYmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Mjg0OTQsImV4cCI6MjA3NjQwNDQ5NH0.fGv4W9D_9lZMlPt7mAsTJJO7sytpLKswxNGGlHz88Fc'

export async function POST(request: NextRequest) {
  try {
    // For now, skip authentication to test AI generation
    // TODO: Add proper authentication later

    const body = await request.json()
    const { subject, level, duration, student_name, learning_objectives, previous_topics } = body

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Create a detailed lesson plan for a ${duration}-minute ${subject} lesson for a ${level} level student named ${student_name}.

Learning objectives: ${learning_objectives}
Previous topics covered: ${previous_topics || 'None specified'}

Please provide:
1. Lesson objectives
2. Warm-up activity (5-10 minutes)
3. Main content/activities (with time allocations)
4. Practice exercises
5. Assessment/check for understanding
6. Homework/next steps
7. Materials needed

Format the response in a clear, structured way that a tutor can easily follow.
    `

    // Generate AI lesson plan
    const result = await model.generateContent(prompt)
    const response = await result.response
    const lessonPlan = response.text()

    // Skip database saving for now to test AI generation
    return NextResponse.json({ lessonPlan })
  } catch (error) {
    console.error('AI lesson plan generation error:', error)
    return NextResponse.json({ error: 'Failed to generate lesson plan' }, { status: 500 })
  }
}
