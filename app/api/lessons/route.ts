import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const LESSONS_FILE = path.join(process.cwd(), 'lessons-data.json')

function getLessons() {
  try {
    if (!fs.existsSync(LESSONS_FILE)) {
      return []
    }
    const data = fs.readFileSync(LESSONS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading lessons:', error)
    return []
  }
}

function saveLessons(lessons: any[]) {
  try {
    fs.writeFileSync(LESSONS_FILE, JSON.stringify(lessons, null, 2))
  } catch (error) {
    console.error('Error saving lessons:', error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const lessons = getLessons()
    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch lessons' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received lesson data:', body)
    
    const { 
      student_id, 
      subject, 
      start_time, 
      duration, 
      notes 
    } = body

    // Validate required fields
    if (!student_id || !subject || !start_time || !duration) {
      console.error('Missing required fields:', { student_id, subject, start_time, duration })
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Get student name for display
    const studentsResponse = await fetch(`${request.nextUrl.origin}/api/students`)
    const studentsData = await studentsResponse.json()
    const student = studentsData.students.find((s: any) => s.id === student_id)

    // Create lesson object
    const lesson = {
      id: Date.now().toString(),
      student_id,
      student_name: student?.name || 'Unknown Student',
      subject,
      start_time,
      duration,
      notes: notes || '',
      status: 'scheduled',
      created_at: new Date().toISOString()
    }

    // Save to file storage
    const lessons = getLessons()
    lessons.push(lesson)
    saveLessons(lessons)

    console.log('Created lesson:', lesson)

    return NextResponse.json({ 
      success: true, 
      lesson,
      message: 'Lesson created successfully' 
    })
  } catch (error) {
    console.error('Lesson creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create lesson' 
    }, { status: 500 })
  }
}