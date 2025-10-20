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

    // For now, return a demo lesson plan since Gemini API model names are unclear
    const lessonPlan = `# ${subject} Lesson Plan for ${student_name}

**Level:** ${level}  
**Duration:** ${duration} minutes  
**Learning Objectives:** ${learning_objectives}

## Lesson Structure

### 1. Warm-up Activity (5-10 minutes)
- Quick review of previous topics: ${previous_topics || 'None specified'}
- Engaging starter activity to get the student focused
- Ice-breaker question related to the topic

### 2. Main Content (${Math.floor(duration * 0.6)} minutes)
- Core concept introduction with clear explanations
- Interactive examples and demonstrations
- Student participation and questions
- Visual aids and real-world applications

### 3. Practice Exercises (${Math.floor(duration * 0.2)} minutes)
- Guided practice problems with teacher support
- Individual work with immediate feedback
- Peer collaboration activities
- Hands-on activities where applicable

### 4. Assessment/Check for Understanding (${Math.floor(duration * 0.1)} minutes)
- Quick quiz or discussion questions
- Student self-assessment
- Teacher feedback and clarification
- Summary of key points

### 5. Homework/Next Steps
- Practice exercises for reinforcement
- Preview of next lesson topics
- Resources for independent study
- Reading assignments or research tasks

## Materials Needed
- Whiteboard/paper for notes
- Practice worksheets
- Relevant textbooks or online resources
- Timer for activity management
- Visual aids (charts, diagrams, etc.)

## Assessment Methods
- Observation during activities
- Quick comprehension checks
- Student self-reflection
- Peer feedback sessions

## Differentiation Strategies
- Adjust difficulty based on student responses
- Provide additional support for struggling students
- Offer extension activities for advanced students
- Use multiple learning modalities

*This lesson plan was generated using AI. The Gemini API integration is being configured.*`

    return NextResponse.json({ lessonPlan })
  } catch (error) {
    console.error('AI lesson plan generation error:', error)
    return NextResponse.json({ error: 'Failed to generate lesson plan' }, { status: 500 })
  }
}
