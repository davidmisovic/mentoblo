import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key')
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    // Create a new supabase client with the user's session
    const supabaseWithAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    })

    const { data: { user } } = await supabaseWithAuth.auth.getUser()
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

    let parentReport: string
    
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'demo-key') {
      const result = await model.generateContent(prompt)
      const response = await result.response
      parentReport = response.text()
    } else {
      // Demo response when no API key is provided
      parentReport = `# Progress Report for ${student_name}

**Subject:** ${subject}  
**Lesson Date:** ${lesson_date}  
**Tutor:** [Your Name]

## Lesson Summary

### Content Covered
${lesson_content}

### Student Performance
${student_performance}

### Areas of Strength
${areas_of_strength || 'Student showed good engagement and participation throughout the lesson.'}

### Areas for Improvement
${areas_for_improvement || 'Continue practicing the concepts covered to build confidence.'}

### Homework Assigned
${homework_assigned || 'Practice exercises related to today\'s lesson content.'}

### Next Lesson Focus
${next_lesson_focus || 'Building on today\'s concepts with additional practice and new related topics.'}

## Recommendations for Home Support
- Encourage regular practice of the concepts covered
- Provide a quiet study space for homework completion
- Review completed work together to reinforce learning
- Contact me if you have any questions about the lesson content

## Overall Assessment
${student_name} is making good progress in ${subject}. With continued practice and support, I'm confident they will continue to improve and build confidence in this subject area.

*Note: This is a demo parent report. For AI-generated content, please add your Gemini API key to the environment variables.*

---
*Generated on ${new Date().toLocaleDateString()}*`
    }

    // Save the AI-generated parent report
    const { data: aiReport, error } = await supabaseWithAuth
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
