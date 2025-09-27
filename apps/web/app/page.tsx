"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { CustomSlider } from '../components/CustomSlider'
import { ResultsReveal } from '../components/ResultsReveal'
import { AlternativeReality } from '../components/AlternativeReality'

export default function LandingPage() {
  const router = useRouter()
  const [currentAct, setCurrentAct] = useState<'hook' | 'interaction' | 'reveal' | 'conversion'>('hook')
  const [sliderValues, setSliderValues] = useState({ age: 30, wastedHours: 2, startAge: 16 })
  const [calculationResult, setCalculationResult] = useState<{ id: string; wasted_years: number } | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [1, 0])

  // Act I: The Hook - Auto-trigger after 1.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentAct('interaction')
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleCalculate = async () => {
    setIsCalculating(true)
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: sliderValues.age,
          wastedHoursPerDay: sliderValues.wastedHours,
          startAge: sliderValues.startAge
        })
      })
      const result = await response.json()
      setCalculationResult(result)
      setCurrentAct('reveal')
    } catch (error) {
      console.error('Calculation failed:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  const allSlidersInteracted = sliderValues.age > 0 && sliderValues.wastedHours > 0 && sliderValues.startAge > 0

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#F5F5F5] overflow-hidden">
      {/* Act I: The Hook */}
      <AnimatePresence>
        {currentAct === 'hook' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <motion.div
              className="w-2 h-2 bg-[#FFBF00] rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="absolute -top-16 text-4xl font-light tracking-wide"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Where did all the time go?
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.5 }}
              className="absolute bottom-20 flex flex-col items-center space-y-2"
            >
              <div className="w-px h-8 bg-[#F5F5F5] opacity-30" />
              <div className="text-xs tracking-widest opacity-50">SCROLL</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Act II: The Interaction */}
      <AnimatePresence>
        {currentAct === 'interaction' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="max-w-2xl w-full space-y-12">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-5xl font-light text-center mb-16"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Where did all the time go?
              </motion.h1>

              <div className="space-y-16">
                <CustomSlider
                  label="Your current age"
                  value={sliderValues.age}
                  min={18}
                  max={80}
                  onChange={(value) => setSliderValues(prev => ({ ...prev, age: value }))}
                />

                <CustomSlider
                  label="Average daily time wasted"
                  value={sliderValues.wastedHours}
                  min={0.5}
                  max={12}
                  step={0.5}
                  showClockVisualization={true}
                  onChange={(value) => setSliderValues(prev => ({ ...prev, wastedHours: value }))}
                />

                <CustomSlider
                  label="The age you started this habit (approx.)"
                  value={sliderValues.startAge}
                  min={10}
                  max={50}
                  onChange={(value) => setSliderValues(prev => ({ ...prev, startAge: value }))}
                />
              </div>

              <motion.button
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: allSlidersInteracted ? 1 : 0.3,
                  boxShadow: allSlidersInteracted ? '0 0 20px rgba(255, 191, 0, 0.3)' : 'none'
                }}
                disabled={!allSlidersInteracted || isCalculating}
                onClick={handleCalculate}
                className="w-full py-6 px-8 bg-[#FFBF00] text-[#1A1A1A] font-semibold text-xl rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {isCalculating ? 'Calculating...' : 'Calculate My Time Debt'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Act III: The Reveal */}
      <AnimatePresence>
        {currentAct === 'reveal' && calculationResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-6"
          >
            <ResultsReveal wastedYears={calculationResult.wasted_years} />
            <AlternativeReality wastedYears={calculationResult.wasted_years} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Act IV: The Conversion */}
      <AnimatePresence>
        {currentAct === 'reveal' && calculationResult && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="max-w-4xl text-center space-y-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4 }}
                className="space-y-8"
              >
                <h2 className="text-4xl font-light leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  These numbers are real. But they don't have to be your future.
                </h2>
                <p className="text-xl text-[#F5F5F5]/70 leading-relaxed max-w-2xl mx-auto">
                  The mirror has shown you the truth. Now, Mentoblo Pro will give you the tools to change it.
                </p>
              </motion.div>

              <motion.a
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 5 }}
                href="/signup"
                className="inline-block py-6 px-12 bg-[#FFBF00] text-[#1A1A1A] font-semibold text-2xl rounded-lg shadow-2xl hover:shadow-[#FFBF00]/30 transition-all duration-300"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 0 30px rgba(255, 191, 0, 0.4)'
                }}
              >
                Start My 14-Day Free Trial
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}