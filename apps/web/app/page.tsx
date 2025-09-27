"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Act1_Hook } from '../components/Acts/Act1_Hook'
import { Act2_Calculator } from '../components/Acts/Act2_Calculator'
import { Act3_Reveal } from '../components/Acts/Act3_Reveal'
import { Act4_Conversion } from '../components/Acts/Act4_Conversion'

export default function LandingPage() {
  const router = useRouter()
  const [currentAct, setCurrentAct] = useState<'hook' | 'calculator' | 'reveal' | 'conversion'>('hook')
  const [sliderValues, setSliderValues] = useState({ age: 30, wastedHours: 2, startAge: 16 })
  const [calculationResult, setCalculationResult] = useState<{ id: string; wasted_years: number } | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [1, 0])

  // Auto-transition from hook to calculator after 1.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentAct('calculator')
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
      
      // Smooth scroll to reveal section
      setTimeout(() => {
        const revealSection = document.getElementById('reveal-section')
        if (revealSection) {
          revealSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500)
    } catch (error) {
      console.error('Calculation failed:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  const allSlidersInteracted = sliderValues.age > 0 && sliderValues.wastedHours > 0 && sliderValues.startAge > 0

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#F5F5F5] overflow-x-hidden">
      {/* Act I: The Hook */}
      <Act1_Hook currentAct={currentAct} />

      {/* Act II: The Calculator */}
      <Act2_Calculator 
        currentAct={currentAct}
        sliderValues={sliderValues}
        setSliderValues={setSliderValues}
        onCalculate={handleCalculate}
        isCalculating={isCalculating}
        allSlidersInteracted={allSlidersInteracted}
      />

      {/* Act III: The Reveal */}
      {currentAct === 'reveal' && calculationResult && (
        <Act3_Reveal 
          wastedYears={calculationResult.wasted_years}
          onComplete={() => setCurrentAct('conversion')}
        />
      )}

      {/* Act IV: The Conversion */}
      {currentAct === 'conversion' && (
        <Act4_Conversion />
      )}
    </div>
  )
}