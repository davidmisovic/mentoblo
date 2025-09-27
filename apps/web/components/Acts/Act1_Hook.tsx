"use client"

import { motion } from 'framer-motion'

interface Act1_HookProps {
  currentAct: string
}

export function Act1_Hook({ currentAct }: Act1_HookProps) {
  if (currentAct !== 'hook') return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      {/* Pulsating dot */}
      <motion.div
        className="w-2 h-2 bg-[#F5F5F5] rounded-full"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* H1 text - animates in letter by letter */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute -top-20 text-5xl font-black font-satoshi tracking-tight"
        style={{ fontSize: '5rem', fontWeight: 800 }}
      >
        Where did all the time go?
      </motion.h1>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="absolute bottom-20 flex flex-col items-center space-y-2"
      >
        <motion.div 
          className="w-px h-8 bg-[#F5F5F5] opacity-30"
          animate={{ height: [32, 48, 32] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="text-xs tracking-widest opacity-50 font-satoshi">SCROLL</div>
      </motion.div>
    </motion.div>
  )
}
