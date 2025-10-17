import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mentoblo - Win Clients, Automate Admin, and Teach Smarter',
  description: 'The all-in-one platform for independent tutors. Streamline your business, automate administrative tasks, and focus on what you do best - teaching.',
  keywords: 'tutoring, education, teaching, business management, automation',
  authors: [{ name: 'Mentoblo Team' }],
  openGraph: {
    title: 'Mentoblo - Win Clients, Automate Admin, and Teach Smarter',
    description: 'The all-in-one platform for independent tutors. Streamline your business, automate administrative tasks, and focus on what you do best - teaching.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
