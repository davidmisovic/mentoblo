"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface AlternativeRealityProps {
  wastedYears: number
}

export function AlternativeReality({ wastedYears }: AlternativeRealityProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])

  const booksRead = Math.round(wastedYears * 52 * 2) // 2 books per week
  const languagesLearned = Math.round(wastedYears * 0.5) // 1 language per 2 years
  const businessValue = Math.round(wastedYears * 10000) // $10k per year

  const cards = [
    {
      icon: "📚",
      title: "Books you could have read",
      value: booksRead,
      suffix: "books"
    },
    {
      icon: "🌍", 
      title: "Languages you could have mastered",
      value: languagesLearned,
      suffix: "languages"
    },
    {
      icon: "💼",
      title: "Side business value you could have built",
      value: businessValue,
      suffix: "$"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3, duration: 0.8 }}
      className="mt-32"
    >
      <motion.div
        ref={containerRef}
        className="flex space-x-8 overflow-hidden"
        style={{ x }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.5 + index * 0.3, duration: 0.6 }}
            className="flex-shrink-0 w-80 bg-[#F5F5F5]/5 backdrop-blur-sm border border-[#F5F5F5]/10 rounded-2xl p-8"
          >
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">{card.icon}</div>
              <h3 className="text-lg font-light text-[#F5F5F5]/80" style={{ fontFamily: 'Inter, sans-serif' }}>
                {card.title}
              </h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4 + index * 0.3, duration: 0.8 }}
                className="text-4xl font-bold text-[#FFBF00]"
                style={{ fontFamily: 'Source Serif Pro, serif' }}
              >
                <AnimatedNumber value={card.value} suffix={card.suffix} />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
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
