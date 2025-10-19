import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'Mentoblo — Build a professional solo tutoring business',
  description: 'Mentoblo is the all‑in‑one platform for independent tutors that helps them win clients, automate admin, and teach smarter with AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white" style={{fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji'}}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}