import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabaseAdmin
      .from('anonymous_calculations')
      .select('count')
      .limit(1)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection working',
      data 
    })
  } catch (e) {
    return NextResponse.json({ 
      success: false, 
      error: 'Connection failed',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 })
  }
}
