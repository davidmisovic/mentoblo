'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

// Create browser client for cookie handling outside component
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnokhlujbcizmarngbhv.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFub2tobHVqYmNpem1hcm5nYmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Mjg0OTQsImV4cCI6MjA3NjQwNDQ5NH0.fGv4W9D_9lZMlPt7mAsTJJO7sytpLKswxNGGlHz88Fc'
)

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error in query params
        const errorParam = searchParams.get('error')
        if (errorParam) {
          setError(errorParam)
          setTimeout(() => router.push('/signin'), 3000)
          return
        }

        // Get the hash from the URL
        const hash = window.location.hash
        console.log('OAuth callback hash:', hash.substring(0, 100) + '...')

        // Parse the hash
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const error = params.get('error')

        if (error) {
          console.error('OAuth error in hash:', error)
          setError(error)
          setTimeout(() => router.push('/signin'), 3000)
          return
        }

        if (accessToken && refreshToken) {
          // Set the session using the tokens from the hash
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            console.error('Error setting session:', sessionError)
            setError(sessionError.message)
            setTimeout(() => router.push('/signin'), 3000)
            return
          }

          if (data.session) {
            console.log('OAuth session established successfully', data.session)
            // Wait a bit longer for cookies to be set
            setTimeout(() => {
              console.log('Redirecting to dashboard...')
              window.location.href = '/dashboard'
            }, 500)
          } else {
            console.error('No session in response:', data)
            setError('Session was not created')
          }
        } else {
          setError('No access token received')
          setTimeout(() => router.push('/signin'), 3000)
        }
      } catch (err) {
        console.error('OAuth callback exception:', err)
        setError('An unexpected error occurred')
        setTimeout(() => router.push('/signin'), 3000)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-700">
              <p className="font-medium">Authentication Error</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-neutral-600">
            Redirecting to sign in...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
          <p className="mt-4 text-sm text-neutral-600">Completing sign in...</p>
        </div>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
              <p className="mt-4 text-sm text-neutral-600">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
