import { NextRequest, NextResponse } from 'next/server'
import { supabasePublic } from '../../../../lib/supabasePublic'

export async function GET(req: NextRequest, { params }: { params: { provider: string } }) {
  const redirectParam = req.nextUrl.searchParams.get('redirect') || '/onboarding'
  const redirectTo = `${req.nextUrl.origin}/auth/callback?redirect=${encodeURIComponent(redirectParam)}`
  const provider = params.provider as 'google' | 'github' | 'gitlab' | 'azure' | 'twitter'
  const { data, error } = await supabasePublic.auth.signInWithOAuth({ provider, options: { redirectTo } })
  if (error || !data?.url) return NextResponse.json({ error: 'OAuth start failed' }, { status: 500 })
  return NextResponse.redirect(data.url)
}

