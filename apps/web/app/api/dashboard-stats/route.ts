import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('mb_user')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabaseAdmin
    .from('daily_stats')
    .select('date,total_wasted_minutes,invested_time')
    .eq('user_id', userId)
    .order('date', { ascending: true })
  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  const totalWastedMinutes = data.reduce((acc, d) => acc + (d.total_wasted_minutes ?? 0), 0)
  return NextResponse.json({ series: data, totalWastedMinutes })
}

