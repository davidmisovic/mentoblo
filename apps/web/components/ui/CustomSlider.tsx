"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'

interface CustomSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  showClockVisualization?: boolean
  onChange: (value: number) => void
}

export function CustomSlider({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  showClockVisualization = false,
  onChange 
}: CustomSliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  
  const percentage = ((value - min) / (max - min)) * 100
  
  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    const newValue = min + (percentage / 100) * (max - min)
    const steppedValue = Math.round(newValue / step) * step
    
    onChange(Math.max(min, Math.min(max, steppedValue)))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h3 
          className="text-3xl font-bold font-satoshi mb-4"
          style={{ fontSize: '3rem', fontWeight: 700 }}
        >
          {label}
        </h3>
        <div 
          className="text-6xl font-bold text-[#FFBF00] font-lora"
          style={{ fontSize: '12rem', fontWeight: 600 }}
        >
          {value}{showClockVisualization ? 'h' : ''}
        </div>
      </div>

      <div className="flex items-center justify-center space-x-16">
        {/* Clock Visualization */}
        {showClockVisualization && (
          <div className="w-32 h-32 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#333"
                strokeWidth="2"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#FFBF00"
                strokeWidth="4"
                strokeDasharray={`${(value / 24) * 283} 283`}
                initial={{ strokeDasharray: '0 283' }}
                animate={{ strokeDasharray: `${(value / 24) * 283} 283` }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-[#F5F5F5]/60 font-satoshi">{value}h</span>
            </div>
          </div>
        )}

        {/* Slider Track */}
        <div 
          className="w-96 h-2 bg-[#333] rounded-full relative cursor-pointer"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#FFBF00] rounded-full"
            style={{ width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.2 }}
          />
          
          <motion.div
            className="absolute top-1/2 w-6 h-6 bg-[#FFBF00] rounded-full shadow-lg cursor-grab active:cursor-grabbing"
            style={{ 
              left: `calc(${percentage}% - 12px)`,
              transform: 'translateY(-50%)'
            }}
            animate={{ 
              scale: isDragging ? 1.2 : 1,
              boxShadow: isDragging ? '0 0 20px rgba(255, 191, 0, 0.5)' : '0 4px 12px rgba(0,0,0,0.3)'
            }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
