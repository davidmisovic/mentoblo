"use client"

import { useState } from "react"
import { motion } from 'framer-motion'
import { Calculator as CalculatorIcon, Target, Clock, TrendingUp } from "lucide-react"
import { CustomSlider } from './ui/CustomSlider'

interface CalculatorProps {
  onCalculate: (result: number) => void
}

export function Calculator({ onCalculate }: CalculatorProps) {
  const [currentAge, setCurrentAge] = useState([25])
  const [timeWasted, setTimeWasted] = useState([2])
  const [ageStarted, setAgeStarted] = useState([13])

  const handleCalculate = () => {
    const yearsHabbit = currentAge[0] - ageStarted[0]
    const hoursPerDay = timeWasted[0]
    const totalHours = yearsHabbit * 365 * hoursPerDay
    const yearsLost = totalHours / (365 * 24)
    
    onCalculate(yearsLost)
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 relative">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/5 to-transparent" />
      
      {/* Floating geometric shapes */}
      <div className="absolute top-1/4 right-1/4 w-2 h-16 bg-accent-primary/20 rotate-45 blur-sm" />
      <div className="absolute bottom-1/4 left-1/6 w-16 h-2 bg-accent-primary/20 rotate-12 blur-sm" />
      
      <div className="max-w-3xl mx-auto space-y-16 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center space-y-8 animate-slide-up">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-accent-primary/20 rounded-full blur-xl animate-glow-pulse" />
            <div className="relative w-20 h-20 bg-surface border border-accent-primary/30 rounded-full flex items-center justify-center">
              <CalculatorIcon className="w-10 h-10 text-accent-primary" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="font-display text-5xl md:text-6xl text-foreground">
              The Instrument of Truth
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed">
              Three precise measurements. One undeniable reality.
              <br />
              <span className="text-accent-primary">Answer with brutal honesty.</span>
            </p>
          </div>
        </div>

        {/* Enhanced Calculator Form */}
        <div className="relative">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-gradient-surface backdrop-blur-xl rounded-2xl border border-border-subtle shadow-elevated" />
          <div className="absolute inset-0 bg-accent-primary/5 rounded-2xl" />
          
          <div className="relative space-y-16 p-8 md:p-16">
            
            {/* Current Age with enhanced styling */}
            <div className="space-y-8 animate-scale-in delay-300">
              <div className="flex items-center gap-4 mb-4">
                <Target className="w-6 h-6 text-accent-primary" />
                <span className="text-accent-primary font-mono text-sm uppercase tracking-wider">
                  Question 01
                </span>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <label className="text-foreground font-medium text-xl">Your current age</label>
                  <p className="text-foreground-muted text-sm mt-1">How many years have you lived?</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-4xl text-accent-primary font-medium block">
                    {currentAge[0]}
                  </span>
                  <span className="text-foreground-subtle text-sm">years</span>
                </div>
              </div>
              
              <CustomSlider
                value={currentAge[0]}
                onValueChange={(value) => setCurrentAge([value])}
                max={80}
                min={15}
                step={1}
                label="Your current age"
              />
            </div>

            {/* Time Wasted with enhanced styling */}
            <div className="space-y-8 animate-scale-in delay-500">
              <div className="flex items-center gap-4 mb-4">
                <Clock className="w-6 h-6 text-accent-primary" />
                <span className="text-accent-primary font-mono text-sm uppercase tracking-wider">
                  Question 02
                </span>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <label className="text-foreground font-medium text-xl">
                    Hours wasted daily
                  </label>
                  <p className="text-foreground-muted text-sm mt-1 max-w-xs">
                    Social media, endless scrolling, mindless browsing, digital distractions
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-4xl text-accent-primary font-medium block">
                    {timeWasted[0]}
                  </span>
                  <span className="text-foreground-subtle text-sm">hours/day</span>
                </div>
              </div>
              
              <CustomSlider
                value={timeWasted[0]}
                onValueChange={(value) => setTimeWasted([value])}
                max={12}
                min={0.5}
                step={0.5}
                label="Hours wasted daily"
              />
            </div>

            {/* Age Started with enhanced styling */}
            <div className="space-y-8 animate-scale-in delay-700">
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp className="w-6 h-6 text-accent-primary" />
                <span className="text-accent-primary font-mono text-sm uppercase tracking-wider">
                  Question 03
                </span>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <label className="text-foreground font-medium text-xl">
                    Age when this started
                  </label>
                  <p className="text-foreground-muted text-sm mt-1">
                    When did these digital habits begin?
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-4xl text-accent-primary font-medium block">
                    {ageStarted[0]}
                  </span>
                  <span className="text-foreground-subtle text-sm">years old</span>
                </div>
              </div>
              
              <CustomSlider
                value={ageStarted[0]}
                onValueChange={(value) => setAgeStarted([value])}
                max={currentAge[0] - 1}
                min={5}
                step={1}
                label="Age when this started"
              />
            </div>

            {/* Enhanced Calculate Button */}
            <div className="pt-12 animate-scale-in delay-900">
              <div className="relative">
                <div className="absolute inset-0 bg-accent-primary/20 rounded-lg blur-xl animate-glow-pulse" />
                <motion.button
                  onClick={handleCalculate}
                  className="relative w-full text-xl h-20 bg-accent-primary hover:bg-accent-glow hover:shadow-glow transition-all duration-slow rounded-lg font-semibold flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reveal the Truth
                  <CalculatorIcon className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
