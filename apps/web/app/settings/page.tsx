"use client"

import { useEffect, useState } from 'react'
import { Button } from '@mentoblo/ui'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [stripeReady, setStripeReady] = useState(Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY))
  const [items, setItems] = useState<{ id: number; name: string; color_hex: string }[]>([])
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#111827')

  async function startCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ priceId: 'price_XXX', userId: 'me' }) })
      const json = await res.json()
      if (json?.url) window.location.href = json.url
      else alert('Stripe not configured yet. Add keys to enable checkout.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setStripeReady(Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY))
    fetch('/api/focus-categories').then(r => r.json()).then(d => setItems(d.items || []))
  }, [])

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-4 text-gray-600">Manage your account, portfolio, and subscription here.</p>
      <section className="mt-10">
        <h2 className="text-lg font-medium">Portfolio categories</h2>
        <div className="mt-4 flex gap-2">
          <input className="w-full rounded-md border px-3 py-2" placeholder="Category name" value={newName} onChange={e => setNewName(e.target.value)} />
          <input className="w-24 rounded-md border px-2" type="color" value={newColor} onChange={e => setNewColor(e.target.value)} />
          <Button onClick={async () => {
            const res = await fetch('/api/focus-categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName, color_hex: newColor }) })
            if (res.ok) {
              const created = await res.json()
              setItems(prev => [...prev, created])
              setNewName('')
            }
          }}>Add</Button>
        </div>
        <ul className="mt-4 divide-y rounded-md border">
          {items.map(it => (
            <li key={it.id} className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="inline-block h-4 w-4 rounded" style={{ background: it.color_hex }} />
                <span>{it.name}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={async () => {
                  const name = prompt('Rename category', it.name) || it.name
                  const color = prompt('Color hex', it.color_hex) || it.color_hex
                  const res = await fetch(`/api/focus-categories/${it.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, color_hex: color }) })
                  if (res.ok) {
                    const updated = await res.json()
                    setItems(prev => prev.map(p => p.id === it.id ? updated : p))
                  }
                }}>Edit</Button>
                <Button variant="ghost" onClick={async () => {
                  const res = await fetch(`/api/focus-categories/${it.id}`, { method: 'DELETE' })
                  if (res.ok) setItems(prev => prev.filter(p => p.id !== it.id))
                }}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-8">
        <Button onClick={startCheckout} disabled={!stripeReady || loading}>
          {loading ? 'Redirecting…' : 'Start free trial'}
        </Button>
        {!stripeReady && (
          <p className="mt-2 text-sm text-gray-500">Stripe keys not set. Button disabled.</p>
        )}
      </div>
    </main>
  )
}

