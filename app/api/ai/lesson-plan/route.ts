import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    const result = await model.generateContent(prompt)
    const response = await result.response
    const lessonPlan = response.text()

    // Save the AI-generated lesson plan
    const { data: aiReport, error } = await supabase
      .from('ai_reports')
      .insert({
        tutor_id: user.id,
        report_type: 'lesson_plan',
        content: lessonPlan
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving AI report:', error)
    }

    return NextResponse.json({ lessonPlan, aiReport })
  } catch (error) {
    console.error('AI lesson plan generation error:', error)
    return NextResponse.json({ error: 'Failed to generate lesson plan' }, { status: 500 })
  }
}
