"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Hero } from '../components/Hero'
import { Calculator } from '../components/Calculator'
import { Result } from '../components/Result'

export default function LandingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'hero' | 'calculator' | 'result'>('hero')
  const [calculationResult, setCalculationResult] = useState<number | null>(null)

  const handleCalculateClick = () => {
    setCurrentStep('calculator')
  }

  const handleCalculate = (result: number) => {
    setCalculationResult(result)
    setCurrentStep('result')
  }

  const handleStartTrial = () => {
    router.push('/signup')
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {currentStep === 'hero' && (
        <Hero onCalculateClick={handleCalculateClick} />
      )}
      
      {currentStep === 'calculator' && (
        <Calculator onCalculate={handleCalculate} />
      )}
      
      {currentStep === 'result' && calculationResult && (
        <Result 
          yearsLost={calculationResult} 
          onStartTrial={handleStartTrial} 
        />
      )}
    </div>
  )
}