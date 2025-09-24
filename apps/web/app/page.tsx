"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@mentoblo/ui'

export default function HomePage() {
  const router = useRouter()
  const [age, setAge] = useState<number>(30)
  const [startAge, setStartAge] = useState<number>(16)
  const [wastedHoursPerDay, setWastedHoursPerDay] = useState<number>(2)
  const [loading, setLoading] = useState(false)

  async function onCalculate() {
    setLoading(true)
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age, startAge, wastedHoursPerDay })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      router.push(`/result/${json.id}`)
    } catch (e) {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
        How many years of your life have you already wasted?
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        A brutally honest calculator that shows you the mathematical reality of your time.
      </p>
      <div className="mx-auto mt-10 grid max-w-lg gap-4 text-left">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Your age</span>
          <Input type="number" value={age} min={0} onChange={e => setAge(Number(e.target.value))} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">When did this pattern start? (age)</span>
          <Input type="number" value={startAge} min={0} onChange={e => setStartAge(Number(e.target.value))} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Average wasted hours per day</span>
          <Input type="number" step="0.1" value={wastedHoursPerDay} min={0} onChange={e => setWastedHoursPerDay(Number(e.target.value))} />
        </label>
        <Button onClick={onCalculate} disabled={loading} className="mt-6">
          {loading ? 'Calculating…' : 'Calculate My Time Debt'}
        </Button>
      </div>
    </main>
  )
}

