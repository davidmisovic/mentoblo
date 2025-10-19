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
    const { student_name, subject, lesson_date, lesson_content, student_performance, areas_of_strength, areas_for_improvement, homework_assigned, next_lesson_focus } = body

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Write a professional parent report for ${student_name} regarding their ${subject} lesson on ${lesson_date}.

Lesson content covered: ${lesson_content}
Student performance: ${student_performance}
Areas of strength: ${areas_of_strength}
Areas for improvement: ${areas_for_improvement}
Homework assigned: ${homework_assigned}
Next lesson focus: ${next_lesson_focus}

Please write this as a formal report that:
1. Is professional and encouraging
2. Provides specific feedback about the student's progress
3. Highlights both strengths and areas for improvement
4. Suggests ways parents can support learning at home
5. Is appropriate for sharing with parents

Format it as a clear, well-structured report.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const parentReport = response.text()

    // Save the AI-generated parent report
    const { data: aiReport, error } = await supabase
      .from('ai_reports')
      .insert({
        tutor_id: user.id,
        report_type: 'parent_report',
        content: parentReport
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving AI report:', error)
    }

    return NextResponse.json({ parentReport, aiReport })
  } catch (error) {
    console.error('AI parent report generation error:', error)
    return NextResponse.json({ error: 'Failed to generate parent report' }, { status: 500 })
  }
}
