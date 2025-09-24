import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('mb_user')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabaseAdmin
    .from('focus_categories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  return NextResponse.json({ items: data })
}

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('mb_user')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { name, color_hex } = body
  const { data, error } = await supabaseAdmin
    .from('focus_categories')
    .insert({ user_id: userId, name, color_hex })
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  return NextResponse.json(data)
}

