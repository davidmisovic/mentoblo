"use client"

import { motion } from 'framer-motion'

export function Act4_Conversion() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="min-h-screen flex items-center justify-center px-6 py-32"
    >
      <div className="max-w-2xl text-center space-y-16">
        {/* Empowering Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="space-y-8"
        >
          <h2 
            className="font-satoshi font-bold"
            style={{ fontSize: '3rem', fontWeight: 700 }}
          >
            These numbers are a fact. They don't have to be your future.
          </h2>
          
          <p 
            className="font-lora"
            style={{ fontSize: '1.25rem', lineHeight: 1.7 }}
          >
            The mirror has shown you the truth. Now, Mentoblo Pro will give you the tools to change it.
          </p>
        </motion.div>

        {/* Final CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.a
            href="/signup"
            className="inline-block px-12 py-6 bg-[#FFBF00] text-[#1A1A1A] font-satoshi font-semibold rounded-lg shadow-2xl hover:shadow-[#FFBF00]/30 transition-all duration-300"
            style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              letterSpacing: '0.05em',
              boxShadow: '0 0 30px rgba(255, 191, 0, 0.4)'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 40px rgba(255, 191, 0, 0.6)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start My 14-Day Free Trial
          </motion.a>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="space-y-4"
        >
          <div 
            className="text-sm text-[#A0A0A0] font-satoshi"
            style={{ fontSize: '1rem' }}
          >
            ✓ No credit card required • ✓ Cancel anytime • ✓ 14-day free trial
          </div>
          <div 
            className="text-xs text-[#A0A0A0]/60 font-satoshi"
            style={{ fontSize: '0.875rem' }}
          >
            Join thousands who have reclaimed their time
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
