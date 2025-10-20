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

    let lessonPlan: string
    
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'demo-key') {
      const result = await model.generateContent(prompt)
      const response = await result.response
      lessonPlan = response.text()
    } else {
      // Demo response when no API key is provided
      lessonPlan = `# ${subject} Lesson Plan for ${student_name}

**Level:** ${level}  
**Duration:** ${duration} minutes  
**Learning Objectives:** ${learning_objectives}

## Lesson Structure

### 1. Warm-up Activity (5-10 minutes)
- Quick review of previous topics: ${previous_topics || 'None specified'}
- Engaging starter activity to get the student focused

### 2. Main Content (${Math.floor(duration * 0.6)} minutes)
- Core concept introduction
- Interactive examples and practice
- Student participation and questions

### 3. Practice Exercises (${Math.floor(duration * 0.2)} minutes)
- Guided practice problems
- Individual work with teacher support
- Peer collaboration activities

### 4. Assessment/Check for Understanding (${Math.floor(duration * 0.1)} minutes)
- Quick quiz or discussion
- Student self-assessment
- Teacher feedback and clarification

### 5. Homework/Next Steps
- Practice exercises for reinforcement
- Preview of next lesson topics
- Resources for independent study

## Materials Needed
- Whiteboard/paper for notes
- Practice worksheets
- Relevant textbooks or online resources
- Timer for activity management

*Note: This is a demo lesson plan. For AI-generated content, please add your Gemini API key to the environment variables.*`
    }

    // Save the AI-generated lesson plan
    const { data: aiReport, error } = await supabaseWithAuth
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
