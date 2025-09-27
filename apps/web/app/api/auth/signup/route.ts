import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Missing email/password' }, { status: 400 })

  const { data: signUp, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })
  if (signUpError || !signUp.user) return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })

  const userId = signUp.user.id
  const trialStart = new Date()
  const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  const { error: subErr } = await supabaseAdmin
    .from('subscriptions')
    .insert({ user_id: userId, status: 'trialing', trial_start: trialStart.toISOString(), trial_end: trialEnd.toISOString() })
  if (subErr) return NextResponse.json({ error: 'Failed to start trial' }, { status: 500 })

  const res = NextResponse.json({ user_id: userId })
  res.cookies.set('mb_user', userId, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
  return res
}

