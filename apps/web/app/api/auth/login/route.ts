import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Missing email/password' }, { status: 400 })
  // Use auth.signInWithPassword on a public client in UI; here we mint a cookie for demo only
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })
  if (error || !data.session) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const res = NextResponse.json({ ok: true, user_id: data.user?.id })
  res.cookies.set('mb_user', data.user?.id || '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
  return res
}

