"use client"

import { FramerLandingPage } from '../../components/framer/FramerLandingPage'
import { FramerComponentWrapper } from '../../components/framer/FramerComponentWrapper'

export default function FramerLandingPageRoute() {
  // Replace this URL with your actual Framer prototype URL
  // Example: "https://framer.com/embed/your-project-id"
  const framerUrl = process.env.NEXT_PUBLIC_FRAMER_LANDING_URL || ""

  return (
    <FramerComponentWrapper>
      <FramerLandingPage 
        framerUrl={framerUrl}
        className="min-h-screen"
      />
    </FramerComponentWrapper>
  )
}