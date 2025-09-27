"use client"

import { motion } from 'framer-motion'
import { CustomSlider } from '../ui/CustomSlider'

interface Act2_CalculatorProps {
  currentAct: string
  sliderValues: { age: number; wastedHours: number; startAge: number }
  setSliderValues: (values: { age: number; wastedHours: number; startAge: number }) => void
  onCalculate: () => void
  isCalculating: boolean
  allSlidersInteracted: boolean
}

export function Act2_Calculator({ 
  currentAct, 
  sliderValues, 
  setSliderValues, 
  onCalculate, 
  isCalculating, 
  allSlidersInteracted 
}: Act2_CalculatorProps) {
  if (currentAct !== 'calculator') return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div className="max-w-4xl w-full space-y-24">
        {/* Age Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="py-24"
        >
          <CustomSlider
            label="Your current age"
            value={sliderValues.age}
            min={18}
            max={80}
            onChange={(value) => setSliderValues({ ...sliderValues, age: value })}
          />
        </motion.div>

        {/* Wasted Time Slider with Clock Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="py-24"
        >
          <CustomSlider
            label="Average daily time wasted"
            value={sliderValues.wastedHours}
            min={0.5}
            max={12}
            step={0.5}
            showClockVisualization={true}
            onChange={(value) => setSliderValues({ ...sliderValues, wastedHours: value })}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center mt-4 text-[#A0A0A0] font-satoshi"
            style={{ fontSize: '1rem' }}
          >
            Be brutally honest. This includes mindless scrolling, content binges, and productive procrastination.
          </motion.p>
        </motion.div>

        {/* Start Age Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="py-24"
        >
          <CustomSlider
            label="The age you started this habit (est.)"
            value={sliderValues.startAge}
            min={10}
            max={50}
            onChange={(value) => setSliderValues({ ...sliderValues, startAge: value })}
          />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex justify-center pt-32"
        >
          <motion.button
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: allSlidersInteracted ? 1 : 0.5,
              boxShadow: allSlidersInteracted ? '0 0 20px rgba(255, 191, 0, 0.3)' : 'none'
            }}
            disabled={!allSlidersInteracted || isCalculating}
            onClick={onCalculate}
            className="px-8 py-4 bg-[#FFBF00] text-[#1A1A1A] font-satoshi font-semibold rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              letterSpacing: '0.05em'
            }}
          >
            {isCalculating ? 'Calculating...' : 'Calculate My Time Debt'}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
