"use client"

import { useEffect, useState } from "react"
import { motion } from 'framer-motion'
import { Hourglass, ArrowRight, BookOpen, MapPin, Lightbulb, Heart } from "lucide-react"

interface ResultProps {
  yearsLost: number
  onStartTrial: () => void
}

export function Result({ yearsLost, onStartTrial }: ResultProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showAlternatives, setShowAlternatives] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 800)
    const timer2 = setTimeout(() => setShowAlternatives(true), 2500)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const formatYears = (years: number) => {
    if (years < 1) {
      const months = Math.round(years * 12)
      return `${months} months`
    }
    return `${years.toFixed(1)} years`
  }

  const getAlternativeActivities = (years: number) => {
    if (years >= 5) {
      return [
        { icon: BookOpen, text: "Read 1,200+ books", description: "Become exceptionally well-read" },
        { icon: MapPin, text: "Travel to 50+ countries", description: "Experience diverse cultures" },
        { icon: Lightbulb, text: "Master 3+ languages", description: "Connect with billions more people" },
        { icon: Heart, text: "Build deep relationships", description: "Create lasting memories" }
      ]
    }
    if (years >= 2) {
      return [
        { icon: BookOpen, text: "Complete a university degree", description: "Gain specialized knowledge" },
        { icon: MapPin, text: "Travel the world for months", description: "Broaden your perspective" },
        { icon: Lightbulb, text: "Learn a musical instrument", description: "Express your creativity" },
        { icon: Heart, text: "Volunteer for causes you care about", description: "Make a positive impact" }
      ]
    }
    if (years >= 1) {
      return [
        { icon: BookOpen, text: "Read 50+ books", description: "Expand your knowledge" },
        { icon: MapPin, text: "Learn a new skill", description: "Enhance your capabilities" },
        { icon: Lightbulb, text: "Start a creative project", description: "Express yourself" },
        { icon: Heart, text: "Deepen relationships", description: "Connect meaningfully" }
      ]
    }
    return [
      { icon: BookOpen, text: "Read dozens of books", description: "Learn something new every day" },
      { icon: MapPin, text: "Explore new hobbies", description: "Discover hidden talents" },
      { icon: Lightbulb, text: "Take online courses", description: "Develop new skills" },
      { icon: Heart, text: "Spend quality time with loved ones", description: "Strengthen bonds" }
    ]
  }

  const alternatives = getAlternativeActivities(yearsLost)

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Cosmic/Constellation Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
        {/* Constellation dots and lines */}
        <div className="absolute inset-0">
          {/* Top left constellation */}
          <div className="absolute top-20 left-20 w-1 h-1 bg-accent-primary/60 rounded-full animate-pulse" />
          <div className="absolute top-32 left-16 w-1 h-1 bg-accent-primary/40 rounded-full animate-pulse delay-1000" />
          <div className="absolute top-24 left-32 w-1 h-1 bg-accent-primary/50 rounded-full animate-pulse delay-2000" />
          <div className="absolute top-28 left-28 w-px h-8 bg-accent-primary/20 rotate-45" />
          <div className="absolute top-36 left-20 w-px h-6 bg-accent-primary/15 rotate-12" />
          
          {/* Top right constellation */}
          <div className="absolute top-24 right-24 w-1 h-1 bg-accent-primary/60 rounded-full animate-pulse delay-500" />
          <div className="absolute top-40 right-16 w-1 h-1 bg-accent-primary/40 rounded-full animate-pulse delay-1500" />
          <div className="absolute top-32 right-32 w-1 h-1 bg-accent-primary/50 rounded-full animate-pulse delay-2500" />
          <div className="absolute top-28 right-28 w-px h-6 bg-accent-primary/20 rotate-12" />
          <div className="absolute top-36 right-20 w-px h-8 bg-accent-primary/15 rotate-45" />
          
          {/* Bottom left constellation */}
          <div className="absolute bottom-32 left-32 w-1 h-1 bg-accent-primary/60 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-20 w-1 h-1 bg-accent-primary/40 rounded-full animate-pulse delay-2000" />
          <div className="absolute bottom-28 left-40 w-1 h-1 bg-accent-primary/50 rounded-full animate-pulse delay-500" />
          <div className="absolute bottom-24 left-24 w-px h-8 bg-accent-primary/20 rotate-12" />
          <div className="absolute bottom-32 left-16 w-px h-6 bg-accent-primary/15 rotate-45" />
          
          {/* Bottom right constellation */}
          <div className="absolute bottom-24 right-20 w-1 h-1 bg-accent-primary/60 rounded-full animate-pulse delay-1500" />
          <div className="absolute bottom-32 right-32 w-1 h-1 bg-accent-primary/40 rounded-full animate-pulse delay-500" />
          <div className="absolute bottom-20 right-40 w-1 h-1 bg-accent-primary/50 rounded-full animate-pulse delay-2500" />
          <div className="absolute bottom-28 right-24 w-px h-6 bg-accent-primary/20 rotate-45" />
          <div className="absolute bottom-32 right-16 w-px h-8 bg-accent-primary/15 rotate-12" />
          
          {/* Center constellation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-accent-primary/80 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-accent-primary/20 rounded-full animate-ping" />
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center space-y-16 relative z-10">
        {/* The Verdict Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-accent-primary font-mono text-sm uppercase tracking-widest"
        >
          THE VERDICT
        </motion.div>

        {/* The Revelation - Centered Layout */}
        <div className="space-y-8">
          {/* "You have lost" */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="font-display text-4xl md:text-5xl text-foreground-muted leading-tight"
          >
            You have lost
          </motion.h2>
          
          {/* The Number - Massive and Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="font-display text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] text-accent-primary font-bold leading-none tracking-tighter">
              {formatYears(yearsLost)}
            </div>
          </motion.div>
          
          {/* "of your precious life" */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="text-3xl md:text-4xl text-foreground-muted"
          >
            of your precious life
          </motion.p>
        </div>

        {/* "In an alternative reality..." - Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="pt-16"
        >
          <p className="text-xl text-foreground font-medium">
            In an alternative reality...
          </p>
        </motion.div>

        {/* Enhanced Alternative Reality Section */}
        <div className={`transition-all duration-1000 ${showAlternatives ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="space-y-12">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl text-foreground font-display">
                In an alternative reality...
              </h3>
              <p className="text-xl text-foreground-muted max-w-3xl mx-auto">
                You could have spent this time building an extraordinary life
              </p>
            </div>
            
            {/* Alternative Activities Grid */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {alternatives.map((activity, index) => (
                <motion.div 
                  key={index}
                  className="group relative bg-surface/30 backdrop-blur-sm border border-border-subtle rounded-2xl p-8 hover:border-accent-primary/50 transition-all duration-slow hover:bg-surface/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="absolute inset-0 bg-accent-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-slow" />
                  <div className="relative space-y-4">
                    <activity.icon className="w-8 h-8 text-accent-primary" />
                    <div className="space-y-2">
                      <h4 className="text-lg font-medium text-foreground">{activity.text}</h4>
                      <p className="text-foreground-muted text-sm">{activity.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* The Path Forward - Enhanced */}
        <div className="space-y-12 animate-fade-in delay-2000">
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl text-foreground font-display">
              But the future remains unwritten.
            </h3>
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-xl text-foreground-muted leading-relaxed">
                Mentoblo helps you reclaim your time, one mindful moment at a time.
              </p>
              <p className="text-lg text-foreground-subtle">
                Transform this painful awareness into powerful action. Your journey to intentional living starts now.
              </p>
            </div>
          </div>
          
          {/* Enhanced CTA */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-accent-primary/20 rounded-lg blur-xl animate-glow-pulse" />
            <motion.button
              onClick={onStartTrial}
              className="relative text-xl px-16 py-8 h-20 bg-accent-primary hover:bg-accent-glow hover:shadow-glow transition-all duration-slow rounded-lg font-semibold flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start My 14-Day Free Trial
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </div>
          
          {/* Trust indicators */}
          <div className="pt-8 space-y-2">
            <p className="text-sm text-foreground-subtle font-mono">
              No credit card required • Cancel anytime • Join 10,000+ mindful individuals
            </p>
          </div>
        </div>

        {/* Soft Bottom Spacing */}
        <div className="h-32" />
      </div>
    </section>
  )
}
