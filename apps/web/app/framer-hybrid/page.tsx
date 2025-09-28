"use client"

import { useState } from 'react'
import { Calculator } from '../../components/Calculator'
import { Result } from '../../components/Result'
import { useRouter } from 'next/navigation'

export default function FramerHybridPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'framer' | 'calculator' | 'result'>('framer')
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
    <div className="min-h-screen bg-background text-foreground">
      {currentStep === 'framer' && (
        <div className="relative w-full h-screen">
          <iframe
            src="https://moody-windows-819566.framer.app/"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            title="Framer Landing Page"
            className="border-0"
          />
          
          {/* Overlay button to transition to calculator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <button
              onClick={handleCalculateClick}
              className="px-8 py-4 bg-accent-primary hover:bg-accent-glow text-background font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
            >
              Start Calculator
            </button>
          </div>
        </div>
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