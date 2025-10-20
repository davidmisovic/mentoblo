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

// GET single invoice
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const invoices = getInvoices()
    const invoice = invoices.find((inv: any) => inv.id === id)
    
    if (!invoice) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invoice not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch invoice' 
    }, { status: 500 })
  }
}

// PATCH update invoice
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    console.log('Updating invoice:', id, body)
    
    const invoices = getInvoices()
    const invoiceIndex = invoices.findIndex((inv: any) => inv.id === id)
    
    if (invoiceIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invoice not found' 
      }, { status: 404 })
    }

    // Update invoice
    invoices[invoiceIndex] = {
      ...invoices[invoiceIndex],
      ...body,
      updated_at: new Date().toISOString()
    }

    saveInvoices(invoices)
    console.log('Updated invoice:', invoices[invoiceIndex])

    return NextResponse.json({ 
      success: true, 
      invoice: invoices[invoiceIndex],
      message: 'Invoice updated successfully' 
    })
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update invoice' 
    }, { status: 500 })
  }
}

// DELETE invoice
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log('Deleting invoice:', id)
    
    const invoices = getInvoices()
    const invoiceIndex = invoices.findIndex((inv: any) => inv.id === id)
    
    if (invoiceIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invoice not found' 
      }, { status: 404 })
    }

    // Remove invoice
    const deletedInvoice = invoices.splice(invoiceIndex, 1)[0]
    saveInvoices(invoices)
    console.log('Deleted invoice:', deletedInvoice)

    return NextResponse.json({ 
      success: true, 
      message: 'Invoice deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete invoice' 
    }, { status: 500 })
  }
}
