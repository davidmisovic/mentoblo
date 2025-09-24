import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { user_id } = await req.json()
  if (!user_id) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
  const res = NextResponse.json({ ok: true })
  res.cookies.set('mb_user', user_id, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
  return res
}

