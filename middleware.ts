import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('Middleware running for:', req.nextUrl.pathname)
  
  // Skip middleware for public routes
  if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/book/')) {
    return NextResponse.next()
  }
  
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // Check if environment variables are available, use hardcoded fallbacks
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnokhlujbcizmarngbhv.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFub2tobHVqYmNpem1hcm5nYmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Mjg0OTQsImV4cCI6MjA3NjQwNDQ5NH0.fGv4W9D_9lZMlPt7mAsTJJO7sytpLKswxNGGlHz88Fc'

  console.log('Using Supabase URL:', supabaseUrl)
  console.log('Using Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing')

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

    console.log('Session check:', { hasSession: !!session, path: req.nextUrl.pathname })

    // If user is signed in and trying to access signin/signup, redirect to dashboard
    if (session && (req.nextUrl.pathname === '/signin' || req.nextUrl.pathname === '/signup')) {
      console.log('Redirecting authenticated user to dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If user is not signed in and trying to access protected routes, redirect to signin
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('Redirecting unauthenticated user to signin')
      return NextResponse.redirect(new URL('/signin', req.url))
    }

  } catch (error) {
    console.error('Middleware error:', error)
  }

  return response
}

export const config = {
  matcher: [
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