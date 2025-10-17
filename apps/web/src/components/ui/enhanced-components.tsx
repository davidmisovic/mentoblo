'use client'

import React, { forwardRef } from 'react'
// Simplified enhanced components without complex HOCs
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Brain, Users, Zap, Sparkles, ArrowRight } from 'lucide-react'

// Simplified animated components

// Feature card with animations
interface AnimatedFeatureCardProps {
  icon: React.ComponentType<any>
  title: string
  description: string
  className?: string
}

export const AnimatedFeatureCard = forwardRef<HTMLDivElement, AnimatedFeatureCardProps>(
  ({ icon: Icon, title, description, className }, ref) => {
    return (
      <Card 
        ref={ref}
        className={`p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${className}`}
      >
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110">
          <Icon className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </Card>
    )
  }
)

AnimatedFeatureCard.displayName = "AnimatedFeatureCard"

// Animated badge component
interface AnimatedStatusBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}

export const AnimatedStatusBadge = forwardRef<HTMLDivElement, AnimatedStatusBadgeProps>(
  ({ children, variant = 'default', className }, ref) => {
    return (
      <div 
        ref={ref}
        className={`transition-all duration-300 hover:scale-105 ${className}`}
      >
        <Badge variant={variant}>
          {children}
        </Badge>
      </div>
    )
  }
)

AnimatedStatusBadge.displayName = "AnimatedStatusBadge"

// Animated step indicator
interface AnimatedStepProps {
  step: number
  title: string
  description: string
  isActive?: boolean
  className?: string
}

export const AnimatedStep = forwardRef<HTMLDivElement, AnimatedStepProps>(
  ({ step, title, description, isActive = false, className }, ref) => {
    return (
      <div 
        ref={ref}
        className={`text-center transition-all duration-300 ${className}`}
      >
        <div className={`
          w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-white font-bold text-xl
          transition-all duration-500 ease-in-out
          ${isActive 
            ? 'bg-orange-500 scale-110 shadow-lg shadow-orange-500/25' 
            : 'bg-slate-300 hover:bg-orange-400 hover:scale-105'
          }
        `}>
          {step}
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </div>
    )
  }
)

AnimatedStep.displayName = "AnimatedStep"

// Animated floating action button
interface AnimatedFABProps {
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

export const AnimatedFAB = forwardRef<HTMLButtonElement, AnimatedFABProps>(
  ({ onClick, children, className }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`
          fixed bottom-6 right-6 w-14 h-14 bg-orange-500 text-white rounded-full 
          flex items-center justify-center shadow-lg hover:shadow-xl
          transition-all duration-300 hover:scale-110 active:scale-95
          z-50
          ${className}
        `}
      >
        {children}
      </button>
    )
  }
)

AnimatedFAB.displayName = "AnimatedFAB"

// Animated progress bar
interface AnimatedProgressProps {
  progress: number
  className?: string
}

export const AnimatedProgress = forwardRef<HTMLDivElement, AnimatedProgressProps>(
  ({ progress, className }, ref) => {
    return (
      <div 
        ref={ref}
        className={`w-full bg-slate-200 rounded-full h-2 overflow-hidden ${className}`}
      >
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    )
  }
)

AnimatedProgress.displayName = "AnimatedProgress"

// Animated counter
interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
}

export const AnimatedCounter = forwardRef<HTMLSpanElement, AnimatedCounterProps>(
  ({ value, duration = 2000, className }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(0)
    
    React.useEffect(() => {
      let startTime: number
      let animationFrame: number
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        
        setDisplayValue(Math.floor(progress * value))
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }
      
      animationFrame = requestAnimationFrame(animate)
      
      return () => cancelAnimationFrame(animationFrame)
    }, [value, duration])
    
    return (
      <span 
        ref={ref}
        className={`font-bold ${className}`}
      >
        {displayValue.toLocaleString()}
      </span>
    )
  }
)

AnimatedCounter.displayName = "AnimatedCounter"
