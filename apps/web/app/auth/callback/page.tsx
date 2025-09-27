"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabasePublic } from '../../../lib/supabasePublic'

export default function AuthCallbackPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function run() {
      try {
        // Supabase returns code in query string; exchange for session
        const code = sp.get('code')
        if (!code) {
          setError('Missing authorization code')
          return
        }
        const { data, error } = await supabasePublic.auth.exchangeCodeForSession(code)
        if (error || !data?.user) {
          setError('Failed to establish session')
          return
        }
        // Set app cookie with user id
        await fetch('/api/auth/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: data.user.id }) })
        const redirect = sp.get('redirect') || '/onboarding'
        router.replace(redirect)
      } catch (e) {
        setError('Unexpected error')
      }
    }
    run()
  }, [router, sp])

  return (
    <main className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">Signing you in…</h1>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </main>
  )
}

