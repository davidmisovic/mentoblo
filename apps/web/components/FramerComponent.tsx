"use client"

import { ComponentType } from 'react'

interface FramerComponentProps {
  component: ComponentType<any>
  [key: string]: any
}

export function FramerComponent({ component: Component, ...props }: FramerComponentProps) {
  if (!Component) {
    return <div>Component not found</div>
  }
  
  return <Component {...props} />
}