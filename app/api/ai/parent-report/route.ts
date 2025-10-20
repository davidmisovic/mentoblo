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
    const { student_name, subject, lesson_date, lesson_content, student_performance, areas_of_strength, areas_for_improvement, homework_assigned, next_lesson_focus } = body

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

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

    // Generate AI parent report
    const result = await model.generateContent(prompt)
    const response = await result.response
    const parentReport = response.text()

    // Skip database saving for now to test AI generation
    return NextResponse.json({ parentReport })
  } catch (error) {
    console.error('AI parent report generation error:', error)
    return NextResponse.json({ error: 'Failed to generate parent report' }, { status: 500 })
  }
}
