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

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload
    const { age, wastedHoursPerDay, startAge } = body
    if (!Number.isFinite(age) || !Number.isFinite(wastedHoursPerDay) || !Number.isFinite(startAge)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const wastedYears = computeWastedYears(age, wastedHoursPerDay, startAge)
    const { data, error } = await supabaseAdmin
      .from('anonymous_calculations')
      .insert({ age, wasted_hours_per_day: wastedHoursPerDay, start_age: startAge, wasted_years: wastedYears })
      .select('id')
      .single()
    if (error) {
      return NextResponse.json({ error: 'Failed to save calculation' }, { status: 500 })
    }
    return NextResponse.json({ id: data.id, wasted_years: wastedYears }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }
}

