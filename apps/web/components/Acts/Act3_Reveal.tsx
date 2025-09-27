"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BookOpen, Globe, Briefcase, Music } from 'lucide-react'

interface Act3_RevealProps {
  wastedYears: number
  onComplete: () => void
}

export function Act3_Reveal({ wastedYears, onComplete }: Act3_RevealProps) {
  const [playSound, setPlaySound] = useState(false)

  useEffect(() => {
    // Play sound effect when component mounts
    const audio = new Audio('/audio/thump.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {
      // Ignore audio play errors (browser restrictions)
    })
  }, [])

  const booksRead = Math.round(wastedYears * 52 * 2) // 2 books per week
  const languagesLearned = Math.round(wastedYears * 0.5) // 1 language per 2 years
  const businessValue = Math.round(wastedYears * 10000) // $10k per year
  const guitarMastery = Math.round(wastedYears * 0.3) // 1 instrument per 3 years

  const alternativeRealityCards = [
    {
      icon: BookOpen,
      title: "You could have read",
      value: booksRead,
      suffix: "books"
    },
    {
      icon: Globe,
      title: "You could have become fluent in",
      value: languagesLearned,
      suffix: "languages"
    },
    {
      icon: Briefcase,
      title: "You could have built a profitable side-business",
      value: businessValue,
      suffix: "$"
    },
    {
      icon: Music,
      title: "You could have mastered the guitar",
      value: guitarMastery,
      suffix: "instruments"
    }
  ]

  return (
    <motion.div
      id="reveal-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-32"
    >
      {/* Main Result */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: 0.5,
          duration: 1.2,
          ease: "easeOut"
        }}
        className="text-center space-y-8 mb-32"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-[#A0A0A0] font-satoshi"
          style={{ fontSize: '1.25rem', lineHeight: 1.7 }}
        >
          You have already lost:
        </motion.p>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 1.5,
            duration: 1,
            ease: "easeOut"
          }}
          className="text-[#FFBF00] font-lora"
          style={{ fontSize: '12rem', fontWeight: 600 }}
        >
          {wastedYears.toFixed(1)}
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="font-lora italic"
          style={{ fontSize: '2rem', fontWeight: 400 }}
        >
          years of your life.
        </motion.p>
      </motion.div>

      {/* Alternative Reality Scroller */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="w-full max-w-4xl"
      >
        <div className="flex space-x-8 overflow-x-auto pb-8">
          {alternativeRealityCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.5 + index * 0.3, duration: 0.6 }}
              className="flex-shrink-0 w-80 bg-[#F5F5F5]/5 backdrop-blur-sm border border-[#F5F5F5]/10 rounded-2xl p-8"
            >
              <div className="text-center space-y-4">
                <card.icon className="w-16 h-16 mx-auto text-[#FFBF00]" />
                <h3 
                  className="font-satoshi"
                  style={{ fontSize: '1.25rem', lineHeight: 1.7 }}
                >
                  {card.title}
                </h3>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4 + index * 0.3, duration: 0.8 }}
                  className="text-4xl font-bold text-[#FFBF00] font-lora"
                  style={{ fontSize: '3rem', fontWeight: 600 }}
                >
                  <AnimatedNumber value={card.value} suffix={card.suffix} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Auto-transition to conversion after delay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6 }}
        onAnimationComplete={onComplete}
        className="mt-16"
      />
    </motion.div>
  )
}

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {displayValue.toLocaleString()}{suffix}
    </span>
  )
}
