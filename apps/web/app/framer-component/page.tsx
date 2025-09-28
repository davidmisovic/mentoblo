"use client"

import { useEffect, useState } from 'react'

export default function FramerComponentPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load the Framer component script
    const script = document.createElement('script')
    script.src = 'https://framer.com/m/Examples-OMAT.js@U1TDJ7uLqwZK3mgjAEIf'
    script.async = true
    script.onload = () => setIsLoaded(true)
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {!isLoaded && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-foreground-muted">Loading Framer component...</p>
          </div>
        </div>
      )}
      
      <div id="framer-component-container" className={`${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        {/* The Framer component will be rendered here */}
      </div>
    </div>
  )
}