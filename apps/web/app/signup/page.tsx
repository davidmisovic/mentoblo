"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@mentoblo/ui'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      router.push('/onboarding')
    } catch (e) {
      alert('Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-24">
      <h1 className="text-2xl font-semibold">
        Okay, 1.8 years is enough. Let's create your account and start reclaiming your time.
      </h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button disabled={loading} className="w-full">{loading ? 'Creating…' : 'Create account'}</Button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account? <a className="underline" href="/login">Log in</a>
      </p>
    </main>
  )
}

