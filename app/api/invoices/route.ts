import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://qnokhlujbcizmarngbhv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFub2tobHVqYmNpem1hcm5nYmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Mjg0OTQsImV4cCI6MjA3NjQwNDQ5NH0.fGv4W9D_9lZMlPt7mAsTJJO7sytpLKswxNGGlHz88Fc'

// File-based storage for invoices
const INVOICES_FILE = path.join(process.cwd(), 'invoices-data.json')

function getInvoices() {
  try {
    if (!fs.existsSync(INVOICES_FILE)) {
      return []
    }
    const data = fs.readFileSync(INVOICES_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading invoices:', error)
    return []
  }
}

function saveInvoices(invoices: any[]) {
  try {
    fs.writeFileSync(INVOICES_FILE, JSON.stringify(invoices, null, 2))
  } catch (error) {
    console.error('Error saving invoices:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received invoice data:', body)
    
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

    // Validate required fields
    if (!invoice_number || !student_id || !issue_date || !due_date) {
      console.error('Missing required fields:', { invoice_number, student_id, issue_date, due_date })
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Get student name for display
    const studentsResponse = await fetch(`${request.nextUrl.origin}/api/students`)
    const studentsData = await studentsResponse.json()
    const student = studentsData.students.find((s: any) => s.id === student_id)

    // Create invoice object
    const invoice = {
      id: Date.now().toString(),
      invoice_number,
      student_id,
      student_name: student?.name || 'Unknown Student',
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

    // Save to file storage
    const invoices = getInvoices()
    invoices.push(invoice)
    saveInvoices(invoices)

    console.log('Created invoice:', invoice)

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
    const invoices = getInvoices()
    
    // Format invoices for display - keep all original fields for dashboard
    const formattedInvoices = invoices.map((invoice: any) => ({
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      student_id: invoice.student_id,
      student_name: invoice.student_name,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      items: invoice.items,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      tax_percentage: invoice.tax_percentage,
      total: invoice.total,
      notes: invoice.notes,
      status: invoice.status,
      created_at: invoice.created_at,
      updated_at: invoice.updated_at,
      // Keep backward compatibility
      amount: invoice.subtotal,
      total_amount: invoice.total,
      students: {
        id: invoice.student_id,
        name: invoice.student_name
      }
    }))

    return NextResponse.json({ invoices: formattedInvoices })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch invoices' 
    }, { status: 500 })
  }
}
