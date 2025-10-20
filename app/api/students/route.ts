import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = 'https://qnokhlujbcizmarngbhv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFub2tobHVqYmNpem1hcm5nYmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Mjg0OTQsImV4cCI6MjA3NjQwNDQ5NH0.fGv4W9D_9lZMlPt7mAsTJJO7sytpLKswxNGGlHz88Fc'

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // For now, skip authentication to test student creation
    // TODO: Add proper authentication later
    
    // Return mock data for now
    const students = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1 (555) 123-4567',
        level: 'A2',
        subjects: ['Mathematics', 'Physics'],
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Marco Rossi',
        email: 'marco@example.com',
        phone: '+1 (555) 987-6543',
        level: 'B1',
        subjects: ['English', 'Chemistry'],
        created_at: new Date().toISOString()
      }
    ]

    return NextResponse.json({ students })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // For now, skip authentication to test student creation
    // TODO: Add proper authentication later
    
    const body = await request.json()
    console.log('Received student data:', body)
    
    const { name, email, phone, parent_name, parent_email, parent_phone, subjects, level, notes } = body

    // Validate required fields
    if (!name || !level) {
      return NextResponse.json({ 
        success: false, 
        error: 'Name and level are required' 
      }, { status: 400 })
    }

    // For now, simulate successful creation
    const student = {
      id: Date.now().toString(),
      name,
      email: email || '',
      phone: phone || '',
      parent_name: parent_name || '',
      parent_email: parent_email || '',
      parent_phone: parent_phone || '',
      subjects: subjects || [],
      level,
      notes: notes || '',
      created_at: new Date().toISOString()
    }

    console.log('Created student:', student)

    return NextResponse.json({ 
      success: true, 
      student,
      message: 'Student created successfully' 
    })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create student' 
    }, { status: 500 })
  }
}
