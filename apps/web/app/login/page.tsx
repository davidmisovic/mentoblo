"use client"

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input } from '@mentoblo/ui'

function LoginForm() {
  const router = useRouter()
  const sp = useSearchParams()
  const redirect = sp.get('redirect') || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      router.push(redirect)
    } catch (e) {
      alert('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-24">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button disabled={loading} className="w-full">{loading ? 'Logging in…' : 'Log in'}</Button>
      </form>
      <div className="mt-6">
        <p className="text-sm text-gray-600">Or continue with</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={() => router.push(`/api/auth/oauth/google?redirect=${encodeURIComponent(redirect)}`)}>Google</Button>
          <Button variant="secondary" onClick={() => router.push(`/api/auth/oauth/github?redirect=${encodeURIComponent(redirect)}`)}>GitHub</Button>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        New here? <a className="underline" href="/signup">Create an account</a>
      </p>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

