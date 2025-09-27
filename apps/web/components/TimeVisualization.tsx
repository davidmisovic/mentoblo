"use client"

import { motion } from 'framer-motion'
import { Clock, Hourglass } from 'lucide-react'

export function TimeVisualization() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Central time visualization */}
      <motion.div
        className="relative w-32 h-32"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border border-accent-primary/20 rounded-full" />
        <div className="absolute inset-2 border border-accent-primary/40 rounded-full" />
        <div className="absolute inset-4 border border-accent-primary/60 rounded-full" />
        
        {/* Floating time elements */}
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2"
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Clock className="w-4 h-4 text-accent-primary/60" />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <Hourglass className="w-4 h-4 text-accent-primary/60" />
        </motion.div>
      </motion.div>
    </div>
  )
}
