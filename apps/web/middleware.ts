import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const isProtected = url.pathname.startsWith('/onboarding') || url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/settings')
  if (!isProtected) return NextResponse.next()

  const hasUserCookie = req.cookies.has('mb_user')
  if (!hasUserCookie) {
    const loginUrl = new URL('/login', url.origin)
    loginUrl.searchParams.set('redirect', url.pathname)
    return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/onboarding/:path*', '/dashboard/:path*', '/settings/:path*']
}

