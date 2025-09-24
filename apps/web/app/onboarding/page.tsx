"use client"

import { useState } from 'react'
import { Button, Input } from '@mentoblo/ui'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [categories, setCategories] = useState<{ name: string; color_hex: string }[]>([
    { name: 'Health', color_hex: '#16a34a' },
    { name: 'Deep Work', color_hex: '#2563eb' }
  ])

  function addCategory() {
    setCategories(prev => [...prev, { name: '', color_hex: '#111827' }])
  }

  async function saveCategories() {
    for (const c of categories.filter(c => c.name.trim().length > 0)) {
      await fetch('/api/focus-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c)
      })
    }
    router.push('/dashboard')
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-2xl font-semibold">Onboarding</h1>
      {step === 1 && (
        <section className="mt-6">
          <p className="text-gray-600">Pick a few focus areas for your Time Portfolio.</p>
          <div className="mt-6 space-y-3">
            {categories.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <Input placeholder="Category name" value={c.name} onChange={e => {
                  const v = e.target.value
                  setCategories(prev => prev.map((x, idx) => idx === i ? { ...x, name: v } : x))
                }} />
                <Input type="color" value={c.color_hex} onChange={e => {
                  const v = e.target.value
                  setCategories(prev => prev.map((x, idx) => idx === i ? { ...x, color_hex: v } : x))
                }} className="w-16 p-1" />
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={addCategory}>Add category</Button>
            <Button onClick={() => setStep(2)}>Continue</Button>
          </div>
        </section>
      )}
      {step === 2 && (
        <section className="mt-6">
          <p className="text-gray-600">Confirm your setup and finish onboarding.</p>
          <ul className="mt-4 list-disc pl-6 text-sm text-gray-700">
            {categories.filter(c => c.name).map((c, i) => (
              <li key={i}>{c.name} ({c.color_hex})</li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={saveCategories}>Finish</Button>
          </div>
        </section>
      )}
    </main>
  )
}

