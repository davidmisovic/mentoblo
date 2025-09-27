"use client"

import { motion } from 'framer-motion'

interface CustomSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onValueChange: (value: number) => void
}

export function CustomSlider({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  onValueChange 
}: CustomSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className="w-full h-2 bg-surface/30 rounded-lg appearance-none cursor-pointer accent-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
        style={{
          background: `linear-gradient(to right, hsl(var(--accent-primary)) 0%, hsl(var(--accent-primary)) ${percentage}%, hsl(var(--surface)) ${percentage}%, hsl(var(--surface)) 100%)`
        }}
      />
      <div className="flex justify-between text-sm text-foreground-subtle font-mono mt-3">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}