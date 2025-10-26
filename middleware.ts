import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('=== MIDDLEWARE DEBUG ===')
  console.log('URL:', req.url)
  console.log('Pathname:', req.nextUrl.pathname)
  console.log('Origin:', req.nextUrl.origin)
  console.log('User-Agent:', req.headers.get('user-agent'))
  console.log('Cookies:', req.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 20)}...`))
  
  // Skip middleware completely for main page
  if (req.nextUrl.pathname === '/') {
    console.log('✅ SKIPPING middleware for main page - returning NextResponse.next()')
    return NextResponse.next()
  }
  
  console.log('⚠️ Middleware will run for:', req.nextUrl.pathname)
  
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found, skipping authentication middleware')
    return response
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            req.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            req.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If user is signed in and the current path is /signin or /signup, redirect to dashboard
    if (session && (req.nextUrl.pathname === '/signin' || req.nextUrl.pathname === '/signup')) {
      console.log('Middleware: User signed in, redirecting from', req.nextUrl.pathname, 'to dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

  // If user is not signed in and the current path is protected, redirect to signin
  // Exclude blog routes and main page from authentication requirement
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('🚨 MIDDLEWARE REDIRECT TRIGGERED!')
    console.log('No session found, redirecting from', req.nextUrl.pathname, 'to signin')
    console.log('Session object:', session)
    console.log('Request URL:', req.url)
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    
    // TEMPORARILY BYPASS MIDDLEWARE REDIRECT FOR DEBUGGING
    console.log('🚨 BYPASSING MIDDLEWARE REDIRECT - ALLOWING DASHBOARD ACCESS')
    return NextResponse.next()
    
    // return NextResponse.redirect(new URL('/signin', req.url))
  }

    // Allow access to main page without authentication (for OAuth callback handling)
    if (req.nextUrl.pathname === '/') {
      console.log('Middleware: Allowing access to main page')
      return response
    }
  } catch (error) {
    console.error('Middleware authentication error:', error)
    // Continue without authentication checks if there's an error
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Only run middleware on specific protected routes
     * Explicitly exclude main page (/) from matcher
     */
    '/dashboard/:path*',
    '/students/:path*',
    '/scheduling/:path*',
    '/invoicing/:path*',
    '/ai/:path*',
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ],
}
