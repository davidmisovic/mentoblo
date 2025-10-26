import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('Middleware running for:', req.nextUrl.pathname)
  
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
      console.log('Middleware: No session, redirecting from', req.nextUrl.pathname, 'to signin')
      return NextResponse.redirect(new URL('/signin', req.url))
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
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - blog (public blog routes)
     * - api/auth/callback (Supabase auth callback)
     * - api/ai (AI API routes)
     * - api/invoices (Invoice API routes)
     * - api/lessons (Lesson API routes)
     * - api/students (Student API routes)
     * - / (main page - handled by client-side OAuth)
     */
    '/((?!_next/static|_next/image|favicon.ico|blog|api/auth/callback|api/ai|api/invoices|api/lessons|api/students|^$).*)',
  ],
}
