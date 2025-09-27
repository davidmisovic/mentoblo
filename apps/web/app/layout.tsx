import './globals.css'
import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Mentoblo',
  description: 'The operating system for the intentional life.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

