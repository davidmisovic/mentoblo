import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')

  // Get the base URL for redirects (works for both dev and production)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(`${baseUrl}/signin?error=auth_failed`)
  }

  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Auth callback error:', exchangeError)
      return NextResponse.redirect(`${baseUrl}/signin?error=auth_failed`)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${baseUrl}/dashboard`)
}
