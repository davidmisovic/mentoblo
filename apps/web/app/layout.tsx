import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Mentoblo',
  description: 'The operating system for the intentional life.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}

