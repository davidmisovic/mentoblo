import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'Mentoblo — Build a professional solo tutoring business',
  description: 'Mentoblo is the all‑in‑one platform for independent tutors that helps them win clients, automate admin, and teach smarter with AI.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Mentoblo',
    statusBarStyle: 'default'
  }
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
        <SpeedInsights />
      </body>
    </html>
  )
}