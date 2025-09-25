import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = req.cookies.get('mb_user')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { name, color_hex } = body
  const { data, error } = await supabaseAdmin
    .from('focus_categories')
    .update({ name, color_hex })
    .eq('id', params.id)
    .eq('user_id', userId)
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = req.cookies.get('mb_user')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { error } = await supabaseAdmin
    .from('focus_categories')
    .delete()
    .eq('id', params.id)
    .eq('user_id', userId)
  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

