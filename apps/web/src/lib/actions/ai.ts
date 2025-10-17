'use server'

import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { revalidatePath } from 'next/cache'
import type { LessonPlanPrompt, FeedbackPrompt, StudentLevel, FeedbackStatus } from '@/types'

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function createLessonPlan(prompt: LessonPlanPrompt) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Get user profile to verify tutor role
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.user_role !== 'tutor') {
    throw new Error('Only tutors can create lesson plans')
  }

  try {
    // Generate lesson plan using Google AI with high-quality prompt
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })

    const prompt = `
  You are an expert curriculum designer for the Mentoblo platform.
  Your task is to create an engaging and structured 60-minute lesson plan.
  Format the entire output in Markdown with clear headings for these sections:
  - ## 🎯 Objectives
  - ## ⏱️ Introduction (5 mins)
  - ## 📚 Core Activities (30 mins)
  - ## ✍️ Practice Exercises (20 mins)
  - ## ✅ Wrap-up & Homework (5 mins)

  ---
  Lesson Details:
  - **Topic:** "${prompt.topic}"
  - **Student's Level:** "${prompt.studentLevel}"
  - **Key Focus Areas:** "${prompt.objectives || 'General understanding and application'}"
  ${prompt.ageGroup ? `- **Age Group:** "${prompt.ageGroup}"` : ''}
  ${prompt.subject ? `- **Subject:** "${prompt.subject}"` : ''}
  ---
`;

    const result = await model.generateContent(prompt)
    const response = await result.response
    const generatedText = response.text()
    
    // Save to database
    const { data, error } = await supabase
      .from('lesson_plans')
      .insert({
        tutor_id: user.id,
        topic: prompt.topic,
        student_level: prompt.studentLevel,
        objectives: prompt.objectives || null,
        generated_plan_markdown: generatedText
      })
      .select()
      .single()

    if (error) {
      throw new Error('Failed to save lesson plan')
    }

    revalidatePath('/dashboard/planner')
    return { success: true, lessonPlan: data, generatedText }
  } catch (error) {
    console.error('Error creating lesson plan:', error)
    throw new Error('Failed to create lesson plan')
  }
}

export async function createFeedbackReport(prompt: FeedbackPrompt, bookingId?: number) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Get user profile to verify tutor role
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.user_role !== 'tutor') {
    throw new Error('Only tutors can create feedback reports')
  }

  try {
    // Generate feedback report using Google AI directly
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

    const result = await model.generateContent([systemPrompt, userPrompt])
    const response = await result.response
    const generatedContent = response.text()
    
    // Get booking information if provided
    let studentId: string | null = null
    let studentName: string | null = null
    let studentEmail: string | null = null

    if (bookingId) {
      const { data: booking } = await supabase
        .from('bookings')
        .select(`
          student_id,
          guest_name,
          guest_email,
          profiles!bookings_student_id_fkey (
            full_name,
            email
          )
        `)
        .eq('id', bookingId)
        .eq('tutor_id', user.id)
        .single()

      if (booking) {
        studentId = booking.student_id
        studentName = booking.guest_name || booking.profiles?.full_name || null
        studentEmail = booking.guest_email || booking.profiles?.email || null
      }
    }
    
    // Save to database
    const { data, error } = await supabase
      .from('feedback_reports')
      .insert({
        tutor_id: user.id,
        student_id: studentId,
        booking_id: bookingId || null,
        student_name: studentName,
        student_email: studentEmail,
        session_topic: prompt.sessionTopic,
        student_performance: prompt.studentPerformance,
        strengths: prompt.strengths || null,
        areas_for_improvement: prompt.areasForImprovement || null,
        recommendations: null, // Will be filled from AI response
        generated_report_markdown: generatedContent
      })
      .select()
      .single()

    if (error) {
      throw new Error('Failed to save feedback report')
    }

    revalidatePath('/dashboard/ai-tools')
    return { success: true, feedbackReport: data }
  } catch (error) {
    console.error('Error creating feedback report:', error)
    throw new Error('Failed to create feedback report')
  }
}

export async function updateFeedbackStatus(
  reportId: number, 
  status: FeedbackStatus
) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Verify the user owns this feedback report
  const { data: report } = await supabase
    .from('feedback_reports')
    .select('tutor_id')
    .eq('id', reportId)
    .single()

  if (!report || report.tutor_id !== user.id) {
    throw new Error('Unauthorized to update this feedback report')
  }

  const updateData: any = { status }
  if (status === 'shared') {
    updateData.shared_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('feedback_reports')
    .update(updateData)
    .eq('id', reportId)

  if (error) {
    throw new Error('Failed to update feedback status')
  }

  revalidatePath('/dashboard/ai-tools')
  return { success: true }
}

export async function deleteLessonPlan(planId: number) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Verify the user owns this lesson plan
  const { data: plan } = await supabase
    .from('lesson_plans')
    .select('tutor_id')
    .eq('id', planId)
    .single()

  if (!plan || plan.tutor_id !== user.id) {
    throw new Error('Unauthorized to delete this lesson plan')
  }

  const { error } = await supabase
    .from('lesson_plans')
    .delete()
    .eq('id', planId)

  if (error) {
    throw new Error('Failed to delete lesson plan')
  }

  revalidatePath('/dashboard/ai-tools')
  return { success: true }
}

export async function generateStudentReport(summaryPoints: string, bookingId: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated.')
  }

  // Verify the user is the tutor for this booking
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('tutor_id, student_id, guest_name, guest_email')
    .eq('id', bookingId)
    .single()

  if (fetchError || booking?.tutor_id !== user.id) {
    throw new Error('Unauthorized: You can only generate reports for your own bookings.')
  }

  try {
    // Generate feedback report using Google AI with high-quality prompt
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })

    const prompt = `
  You are a helpful and encouraging tutor on the Mentoblo platform.
  Your task is to write a professional, positive, and clear feedback report for a parent or an adult student based on the provided summary points.
  Your tone must be supportive and constructive. Structure the report with a positive opening, details of the key points, and an encouraging closing statement. Do not use Markdown formatting, just plain text with paragraphs.

  ---
  Tutor's Summary Points from the Session:
  ${summaryPoints}
  ---
`;

    const result = await model.generateContent(prompt)
    const response = await result.response
    const generatedText = response.text()
    
    // Save to student_reports table
    const { data, error } = await supabase
      .from('student_reports')
      .insert({
        tutor_id: user.id,
        student_id: booking.student_id,
        booking_id: bookingId,
        summary_points: summaryPoints,
        generated_report_text: generatedText
      })
      .select()
      .single()

    if (error) {
      throw new Error('Failed to save student report')
    }

    revalidatePath('/dashboard')
    return { success: true, report: data, generatedText }
  } catch (error) {
    console.error('Error generating student report:', error)
    throw new Error('Failed to generate student report')
  }
}

