"use client"

import { useEffect, useMemo, useState } from 'react'

type Point = { date: string; total_wasted_minutes: number; invested_time: { category_id: number; minutes: number }[] | null }

export default function DashboardPage() {
  const [data, setData] = useState<Point[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetch('/api/dashboard-stats').then(r => r.json()).then(d => {
      setData(d.series || [])
      setTotal(d.totalWastedMinutes || 0)
    })
  }, [])

  const path = useMemo(() => {
    if (!data.length) return ''
    const points = data.map((p, i) => {
      const x = (i / Math.max(1, data.length - 1)) * 600
      const y = 200 - Math.min(200, (p.total_wasted_minutes || 0) / 5)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    return points.join(' ')
  }, [data])

  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-gray-600">Total wasted minutes in range: {total}</p>
      <div className="mt-8 overflow-hidden rounded-md border">
        <svg width="640" height="240" viewBox="0 0 640 240">
          <rect x="0" y="0" width="640" height="240" fill="#fff" />
          <path d={path} stroke="#ef4444" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </main>
  )
}

