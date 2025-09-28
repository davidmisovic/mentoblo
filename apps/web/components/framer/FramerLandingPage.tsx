"use client"

import { useEffect, useState } from 'react'

interface FramerLandingPageProps {
  framerUrl?: string
  className?: string
}

export function FramerLandingPage({ framerUrl, className = "" }: FramerLandingPageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!framerUrl) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-background ${className}`}>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Framer Design Ready</h2>
          <p className="text-foreground-muted">Add your Framer prototype URL to see the design</p>
          <div className="text-sm text-foreground-subtle font-mono">
            Update the framerUrl prop in your page component
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {!isLoaded && (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-foreground-muted">Loading Framer design...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={framerUrl}
        width="100%"
        height="100vh"
        frameBorder="0"
        allowFullScreen
        className={`${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        onLoad={() => setIsLoaded(true)}
        title="Framer Landing Page"
      />
    </div>
  )
}