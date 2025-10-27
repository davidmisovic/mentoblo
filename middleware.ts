import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Skip middleware for public routes
  if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/book/')) {
    return NextResponse.next()
  }
  
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
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

    // If user is signed in and trying to access signin/signup, redirect to dashboard
    if (session && (req.nextUrl.pathname === '/signin' || req.nextUrl.pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If user is not signed in and trying to access protected routes, redirect to signin
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
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