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
      console.log('Sending request to /api/calculate with:', { age, startAge, wastedHoursPerDay })
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age, startAge, wastedHoursPerDay })
      })
      console.log('Response status:', res.status)
      const json = await res.json()
      console.log('Response data:', json)
      if (!res.ok) throw new Error(json.error || 'Failed')
      router.push(`/result/${json.id}`)
    } catch (e) {
      console.error('Calculate error:', e)
      alert(`Error: ${e instanceof Error ? e.message : 'Something went wrong. Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32">
        <div className="text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tight">
              How many <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">years</span> of your life have you already <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">wasted</span>?
            </h1>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              A brutally honest calculator that shows you the <span className="text-white font-semibold">mathematical reality</span> of your time.
            </p>
          </div>

          {/* Calculator Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-8">
                <div className="grid gap-6">
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-white">Your current age</label>
                    <Input 
                      type="number" 
                      value={age} 
                      min={0} 
                      onChange={e => setAge(Number(e.target.value))}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg py-4 px-6 rounded-xl"
                      placeholder="Enter your age"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-white">When did this pattern start? (age)</label>
                    <Input 
                      type="number" 
                      value={startAge} 
                      min={0} 
                      onChange={e => setStartAge(Number(e.target.value))}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg py-4 px-6 rounded-xl"
                      placeholder="Age when you started wasting time"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-white">Average wasted hours per day</label>
                    <Input 
                      type="number" 
                      step="0.1" 
                      value={wastedHoursPerDay} 
                      min={0} 
                      onChange={e => setWastedHoursPerDay(Number(e.target.value))}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg py-4 px-6 rounded-xl"
                      placeholder="Hours per day"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={onCalculate} 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xl py-6 px-8 rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Calculating your reality...</span>
                    </div>
                  ) : (
                    'Calculate My Time Debt'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 space-y-4">
            <div className="text-lg text-gray-400">
              Join <span className="text-white font-semibold">thousands</span> who have faced their time reality
            </div>
            <div className="text-sm text-gray-500">
              ✓ Anonymous • ✓ Free • ✓ Life-changing insights
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

