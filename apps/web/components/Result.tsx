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
    <section className="min-h-screen flex items-center justify-center px-6 py-20 relative">
      {/* Enhanced atmospheric background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-background" />
      <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      
      <div className="max-w-5xl mx-auto text-center space-y-20 relative z-10">
        {/* Enhanced Icon with glow effect */}
        <div className="animate-fade-in relative">
          <div className="absolute inset-0 bg-accent-primary/20 rounded-full blur-2xl animate-glow-pulse w-32 h-32 mx-auto" />
          <div className="relative w-24 h-24 bg-surface border border-accent-primary/30 rounded-full flex items-center justify-center mx-auto">
            <Hourglass className="w-12 h-12 text-accent-primary" />
          </div>
        </div>

        {/* The Revelation with enhanced drama */}
        <div className="space-y-12">
          <div className="space-y-6 animate-fade-in delay-300">
            <div className="text-accent-primary font-mono text-sm uppercase tracking-widest">
              The Verdict
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-foreground-muted leading-tight">
              You have lost
            </h2>
          </div>
          
          {/* The Number - Monument to Time Lost */}
          <div className={`transition-all duration-1200 ${isVisible ? 'animate-number-reveal' : 'opacity-0'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-accent-primary/10 blur-3xl rounded-full" />
              <div className="relative font-display text-9xl md:text-[10rem] lg:text-[14rem] xl:text-[18rem] text-accent-primary font-bold leading-none tracking-tighter">
                {formatYears(yearsLost)}
              </div>
            </div>
            <p className="text-3xl md:text-4xl text-foreground-muted mt-8 animate-fade-in delay-1000">
              of your precious life
            </p>
          </div>
        </div>

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
