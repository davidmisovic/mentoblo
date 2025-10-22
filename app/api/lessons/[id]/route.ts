import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const lessonsDataPath = path.join(process.cwd(), 'lessons-data.json')

// Helper function to read lessons data
function readLessonsData() {
  try {
    if (fs.existsSync(lessonsDataPath)) {
      const data = fs.readFileSync(lessonsDataPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading lessons data:', error)
  }
  return []
}

// Helper function to write lessons data
function writeLessonsData(lessons: any[]) {
  try {
    fs.writeFileSync(lessonsDataPath, JSON.stringify(lessons, null, 2))
  } catch (error) {
    console.error('Error writing lessons data:', error)
  }
}

// GET - Fetch a single lesson
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lessons = readLessonsData()
    const lesson = lessons.find((l: any) => l.id === params.id)
    
    if (!lesson) {
      return NextResponse.json({ 
        success: false, 
        error: 'Lesson not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      lesson 
    })
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch lesson' 
    }, { status: 500 })
  }
}

// PATCH - Update a lesson
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    console.log('Received lesson update data:', body)
    
    const lessons = readLessonsData()
    const lessonIndex = lessons.findIndex((l: any) => l.id === params.id)
    
    if (lessonIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Lesson not found' 
      }, { status: 404 })
    }

    // Update the lesson
    const updatedLesson = {
      ...lessons[lessonIndex],
      ...body,
      updated_at: new Date().toISOString()
    }

    lessons[lessonIndex] = updatedLesson
    writeLessonsData(lessons)

    console.log('Updated lesson:', updatedLesson)
    return NextResponse.json({ 
      success: true, 
      lesson: updatedLesson 
    })
  } catch (error) {
    console.error('Lesson update error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update lesson' 
    }, { status: 500 })
  }
}

// DELETE - Delete a lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lessons = readLessonsData()
    const lessonIndex = lessons.findIndex((l: any) => l.id === params.id)
    
    if (lessonIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Lesson not found' 
      }, { status: 404 })
    }

    // Remove the lesson
    const deletedLesson = lessons.splice(lessonIndex, 1)[0]
    writeLessonsData(lessons)

    console.log('Deleted lesson:', deletedLesson)
    return NextResponse.json({ 
      success: true, 
      message: 'Lesson deleted successfully' 
    })
  } catch (error) {
    console.error('Lesson deletion error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete lesson' 
    }, { status: 500 })
  }
}
