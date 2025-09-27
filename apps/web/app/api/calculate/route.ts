import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

type Payload = {
  age: number
  wastedHoursPerDay: number
  startAge: number
}

function computeWastedYears(age: number, wastedHoursPerDay: number, startAge: number) {
  const years = Math.max(0, age - startAge)
  const days = years * 365
  const totalWastedHours = days * wastedHoursPerDay
  return totalWastedHours / (24 * 365)
}

export async function GET() {
  return NextResponse.json({ message: 'Calculate API is working', method: 'GET' })
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload
    const { age, wastedHoursPerDay, startAge } = body
    
    // Debug logging
    console.log('Calculate API called with:', { age, wastedHoursPerDay, startAge })
    
    if (!Number.isFinite(age) || !Number.isFinite(wastedHoursPerDay) || !Number.isFinite(startAge)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const wastedYears = computeWastedYears(age, wastedHoursPerDay, startAge)
    
    console.log('Attempting to insert into Supabase...')
    const { data, error } = await supabaseAdmin
      .from('anonymous_calculations')
      .insert({ age, wasted_hours_per_day: wastedHoursPerDay, start_age: startAge, wasted_years: wastedYears })
      .select('id')
      .single()
      
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: 'Failed to save calculation', 
        details: error.message 
      }, { status: 500 })
    }
    
    console.log('Successfully saved calculation:', data)
    return NextResponse.json({ id: data.id, wasted_years: wastedYears }, { status: 200 })
  } catch (e) {
    console.error('Calculate API error:', e)
    return NextResponse.json({ 
      error: 'Bad Request', 
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 400 })
  }
}

