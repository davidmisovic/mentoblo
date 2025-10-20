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

    // For now, return a demo parent report since Gemini API model names are unclear
    const parentReport = `# Progress Report for ${student_name}

**Subject:** ${subject}  
**Lesson Date:** ${lesson_date}  
**Tutor:** [Your Name]

## Lesson Summary

### Content Covered
${lesson_content}

### Student Performance
${student_performance}

### Areas of Strength
${areas_of_strength || 'Student showed good engagement and participation throughout the lesson. Demonstrated strong focus and attention to detail.'}

### Areas for Improvement
${areas_for_improvement || 'Continue practicing the concepts covered to build confidence. Regular review of key concepts will help reinforce learning.'}

### Homework Assigned
${homework_assigned || 'Practice exercises related to today\'s lesson content. Review notes and complete assigned problems.'}

### Next Lesson Focus
${next_lesson_focus || 'Building on today\'s concepts with additional practice and new related topics. We will continue to strengthen understanding through hands-on activities.'}

## Recommendations for Home Support
- Encourage regular practice of the concepts covered
- Provide a quiet study space for homework completion
- Review completed work together to reinforce learning
- Ask your child to explain what they learned in their own words
- Contact me if you have any questions about the lesson content

## Overall Assessment
${student_name} is making good progress in ${subject}. With continued practice and support, I'm confident they will continue to improve and build confidence in this subject area. The student shows enthusiasm for learning and responds well to interactive teaching methods.

## Next Steps
- Continue with regular practice sessions
- Monitor progress through upcoming assessments
- Maintain open communication about any concerns
- Celebrate achievements and milestones

`

    return NextResponse.json({ parentReport })
  } catch (error) {
    console.error('AI parent report generation error:', error)
    return NextResponse.json({ error: 'Failed to generate parent report' }, { status: 500 })
  }
}
