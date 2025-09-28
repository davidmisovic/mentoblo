"use client"

import { Suspense } from 'react'

interface FramerComponentWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FramerComponentWrapper({ children, fallback }: FramerComponentWrapperProps) {
  const defaultFallback = (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-foreground-muted">Loading design...</p>
      </div>
    </div>
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}