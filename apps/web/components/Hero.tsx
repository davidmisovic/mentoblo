"use client"

import { motion } from 'framer-motion'
import { ChevronDown, Clock, Hourglass } from 'lucide-react'
import { TimeVisualization } from './TimeVisualization'

interface HeroProps {
  onCalculateClick: () => void
}

export function Hero({ onCalculateClick }: HeroProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-background to-accent-glow/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      
      {/* Animated floating elements */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-accent-primary/5 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-accent-glow/10 blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/6 w-24 h-24 rounded-full bg-accent-primary/8 blur-2xl animate-pulse delay-2000" />
      
      {/* Geometric accent lines */}
      <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-transparent to-accent-primary/20" />
      <div className="absolute bottom-0 right-1/3 w-px h-24 bg-gradient-to-t from-transparent to-accent-primary/20" />
      
      {/* Time Visualization Component */}
      <TimeVisualization />
      
      <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
        {/* Floating icons */}
        <div className="absolute -top-16 left-1/4 animate-pulse">
          <Clock className="w-8 h-8 text-accent-primary/40" />
        </div>
        <div className="absolute -top-20 right-1/4 animate-pulse delay-500">
          <Hourglass className="w-6 h-6 text-accent-primary/30" />
        </div>
        
        {/* Main headline with enhanced typography */}
        <div className="space-y-6">
          <div className="text-sm font-mono text-accent-primary uppercase tracking-widest animate-fade-in">
            Digital Awakening
          </div>
          
          <h1 className="font-display text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] text-foreground animate-fade-in delay-300 leading-none">
            Where did all the
            <span className="block bg-gradient-to-r from-accent-primary via-accent-glow to-accent-primary-subtle bg-clip-text text-transparent mt-4 animate-fade-in delay-500">
              time go?
            </span>
          </h1>
        </div>
        
        {/* Enhanced subtitle with better spacing */}
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in delay-700">
          <p className="text-xl md:text-2xl text-foreground-muted leading-relaxed">
            A moment of clarity in an age of distraction.
          </p>
          <p className="text-lg md:text-xl text-foreground-subtle leading-relaxed">
            Calculate the true cost of your digital habits and transform awareness into action.
          </p>
        </div>
        
        {/* Enhanced CTA Button with glass morphism effect */}
        <div className="pt-12 animate-fade-in delay-1000">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-accent-primary/20 rounded-lg blur-xl animate-glow-pulse" />
            <motion.button
              onClick={onCalculateClick}
              className="relative text-xl px-16 py-8 h-20 bg-surface/30 backdrop-blur-sm border-accent-primary/50 hover:bg-accent-primary/10 hover:border-accent-primary hover:shadow-glow transition-all duration-slow rounded-lg font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Calculate My Time Debt
            </motion.button>
          </div>
        </div>
        
        {/* Micro-interaction hint */}
        <div className="pt-8 animate-fade-in delay-1200">
          <p className="text-sm text-foreground-subtle font-mono">
            Three questions. One revelation.
          </p>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center space-y-2 animate-fade-in delay-1500">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-accent-primary/50" />
          <ChevronDown className="w-6 h-6 text-accent-primary animate-bounce" />
          <div className="text-xs text-foreground-subtle font-mono">Scroll</div>
        </div>
      </div>
    </section>
  )
}
