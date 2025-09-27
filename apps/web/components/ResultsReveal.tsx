"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ResultsRevealProps {
  wastedYears: number
}

export function ResultsReveal({ wastedYears }: ResultsRevealProps) {
  const [playSound, setPlaySound] = useState(false)

  useEffect(() => {
    // Play sound effect when component mounts
    const audio = new Audio('/thump.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {
      // Ignore audio play errors (browser restrictions)
    })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-8"
    >
      {/* Black screen hold */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-[#1A1A1A] z-40"
      />
      
      {/* Main reveal */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: 0.5,
          duration: 1.2,
          ease: "easeOut"
        }}
        className="relative z-50"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-2xl font-light mb-8"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          You have already lost:
        </motion.h1>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 1.5,
            duration: 1,
            ease: "easeOut"
          }}
          className="text-9xl font-bold text-[#FFBF00] mb-4"
          style={{ fontFamily: 'Source Serif Pro, serif' }}
        >
          {wastedYears.toFixed(1)}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="text-4xl font-light"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          years of your life.
        </motion.h2>
      </motion.div>
    </motion.div>
  )
}
