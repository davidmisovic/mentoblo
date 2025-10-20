import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = 'https://qnokhlujbcizmarngbhv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFub2tobHVqYmNpem1hcm5nYmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Mjg0OTQsImV4cCI6MjA3NjQwNDQ5NH0.fGv4W9D_9lZMlPt7mAsTJJO7sytpLKswxNGGlHz88Fc'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      invoice_number, 
      student_id, 
      issue_date, 
      due_date, 
      items, 
      subtotal, 
      tax, 
      total, 
      notes, 
      status 
    } = body

    // For now, we'll simulate saving to database
    // In a real implementation, you would save to Supabase
    console.log('Creating invoice:', {
      invoice_number,
      student_id,
      issue_date,
      due_date,
      items,
      subtotal,
      tax,
      total,
      notes,
      status
    })

    // Simulate successful creation
    const invoice = {
      id: Date.now().toString(),
      invoice_number,
      student_id,
      issue_date,
      due_date,
      items,
      subtotal,
      tax,
      total,
      notes,
      status,
      created_at: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      invoice,
      message: 'Invoice created successfully' 
    })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create invoice' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data
    // In a real implementation, you would fetch from Supabase
    const invoices = [
      {
        id: '1',
        invoice_number: 'INV-001',
        issue_date: '2024-01-15',
        due_date: '2024-01-30',
        amount: 120.00,
        total_amount: 120.00,
        status: 'paid',
        students: {
          id: '1',
          name: 'Sarah Johnson'
        }
      },
      {
        id: '2',
        invoice_number: 'INV-002',
        issue_date: '2024-01-20',
        due_date: '2024-02-05',
        amount: 180.00,
        total_amount: 180.00,
        status: 'sent',
        students: {
          id: '2',
          name: 'Marco Rossi'
        }
      }
    ]

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch invoices' 
    }, { status: 500 })
  }
}
