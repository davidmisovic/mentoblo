'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Zap, 
  Brain, 
  Shield, 
  Globe, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  BookOpen, 
  Video, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Check, 
  Menu,
  Target,
  Clock,
  DollarSign,
  BarChart3,
  MessageSquare,
  FileText,
  Settings,
  User,
  LogIn
} from 'lucide-react'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      {/* Top Nav */}
      <header className="sticky z-50 bg-white/80 border-neutral-200/70 border-b top-0 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <a href="#" className="flex items-center gap-2 group">
              <div className="h-7 w-7 rounded-[8px] border border-neutral-200 bg-white shadow-sm grid place-items-center">
                <span className="text-[13px] font-medium tracking-tight text-neutral-900">M</span>
              </div>
              <span className="text-[15px] font-medium tracking-tight text-neutral-900">Mentoblo</span>
            </a>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#pillars" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Product</a>
              <a href="#why" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Why Mentoblo</a>
              <a href="#ai" className="text-[14px] hover:text-neutral-900 transition text-neutral-700">Pricing</a>
              <a href="#contact" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Contact</a>
            </nav>
            <div className="flex items-center gap-3">
              <a href="/signin" className="hidden sm:inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3.5 py-2 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 transition">
                <LogIn className="h-4 w-4" />
                Sign in
              </a>
              <a href="/signup" className="inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-3.5 py-2 text-[14px] font-medium text-white hover:bg-neutral-800 hover:border-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 transition">
                <Sparkles className="h-4 w-4" />
                Get started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="md:pt-20 md:pb-12 max-w-7xl mx-auto pt-14 px-6 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[12px] text-neutral-700 shadow-sm">
                <Target className="h-3.5 w-3.5" />
                Purpose-built for independent tutors
              </div>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900">
                Build a professional solo tutoring business
              </h1>
              <p className="mt-4 text-lg text-neutral-600 max-w-2xl">
                Mentoblo is the all‑in‑one platform for independent tutors that helps them win clients, automate admin, and teach smarter with AI.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href="/signup" className="inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-6 py-3 text-[14px] font-medium text-white hover:bg-neutral-800 hover:border-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 transition">
                  <Sparkles className="h-4 w-4" />
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#demo" className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-6 py-3 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 transition">
                  <Video className="h-4 w-4" />
                  Watch demo
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-300 flex items-center justify-center">
                    <Brain className="h-8 w-8 text-neutral-600" />
                  </div>
                  <p className="text-neutral-600 font-medium">Hero Image Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section id="pillars" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
              Three pillars of your success
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Everything you need to build a professional and prosperous solo teaching business
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "The Growth Engine",
                description: "We help you get more clients",
                features: [
                  "Professional public page with SEO",
                  "Integrated booking & payment system", 
                  "Lead management mini-CRM",
                  "Instant client conversion"
                ],
                color: "bg-blue-500"
              },
              {
                icon: Zap,
                title: "The Operating System", 
                description: "We automate your entire business",
                features: [
                  "Command center dashboard",
                  "Smart calendar & scheduling",
                  "Complete student CRM",
                  "Automated invoicing with Stripe",
                  "Virtual classroom & notes",
                  "Materials library"
                ],
                color: "bg-green-500"
              },
              {
                icon: Sparkles,
                title: "The AI Copilot",
                description: "We save you time & elevate quality", 
                features: [
                  "AI lesson planner (powered by Gemini)",
                  "AI parent report generator",
                  "AI communication assistant",
                  "Smart content suggestions"
                ],
                color: "bg-purple-500"
              }
            ].map((pillar, index) => (
              <Card key={pillar.title} className="p-8 hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 rounded-2xl ${pillar.color} flex items-center justify-center mb-6`}>
                  <pillar.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{pillar.title}</h3>
                <p className="text-neutral-600 mb-6">{pillar.description}</p>
                <ul className="space-y-3">
                  {pillar.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-neutral-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="why" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Stop juggling 5-7 different tools. Mentoblo brings everything together in one elegant platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Intelligent Scheduling",
                description: "Two-way sync with Google/Outlook. Set your availability once and let clients book instantly."
              },
              {
                icon: Users,
                title: "Complete Student CRM", 
                description: "Track every student&apos;s progress, notes, payment history, and materials in one place."
              },
              {
                icon: CreditCard,
                title: "Stripe Integration",
                description: "Accept payments, generate invoices, and track revenue automatically with Stripe Connect."
              },
              {
                icon: Video,
                title: "Virtual Classroom",
                description: "Integrated video calls with real-time shared notes that auto-save to each session."
              },
              {
                icon: BookOpen,
                title: "Materials Library",
                description: "Centralized storage for all your teaching materials, easily shareable with students."
              },
              {
                icon: Brain,
                title: "AI Powered Tools",
                description: "Generate lesson plans, parent reports, and professional communications with AI assistance."
              }
            ].map((feature) => (
              <div key={feature.title} className="group p-8 rounded-2xl border-2 border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-4 group-hover:bg-neutral-200 transition-colors">
                  <feature.icon className="w-6 h-6 text-neutral-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to build your teaching empire?
          </h2>
          <p className="mt-4 text-lg text-neutral-300 max-w-2xl mx-auto">
            Join hundreds of tutors who&apos;ve transformed their solo practice into a thriving business with Mentoblo.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="inline-flex items-center gap-2 rounded-md border border-white bg-white px-6 py-3 text-[14px] font-medium text-neutral-900 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition">
              <Sparkles className="h-4 w-4" />
              Start Your Free Trial
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#demo" className="inline-flex items-center gap-2 rounded-md border border-neutral-700 bg-transparent px-6 py-3 text-[14px] font-medium text-white hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition">
              <Video className="h-4 w-4" />
              Schedule a Demo
            </a>
          </div>
          <p className="mt-6 text-sm text-neutral-400">
            Trusted by 500+ independent tutors and coaches worldwide
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 rounded-[8px] border border-neutral-200 bg-white shadow-sm grid place-items-center">
                  <span className="text-[13px] font-medium tracking-tight text-neutral-900">M</span>
                </div>
                <span className="text-[15px] font-medium tracking-tight text-neutral-900">Mentoblo</span>
              </div>
              <p className="text-sm text-neutral-600">
                The all-in-one platform for independent tutors and coaches.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition">Features</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition">Pricing</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition">Use Cases</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition">About</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition">Blog</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition">Careers</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition">Help Center</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition">Documentation</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition">API Reference</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-600">
              © {new Date().getFullYear()} Mentoblo. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-neutral-600">
              <a href="#" className="hover:text-neutral-900 transition">Privacy Policy</a>
              <a href="#" className="hover:text-neutral-900 transition">Terms of Service</a>
              <a href="#" className="hover:text-neutral-900 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}