import { AuthButton } from '@/components/auth/auth-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Star, Users, Zap, Brain, Shield, Globe, Sparkles } from 'lucide-react'
import { 
  AnimatedHeader, 
  AnimatedLogo, 
  AnimatedNavItem, 
  AnimatedButton
} from '@/components/ui/animated-header'
import { 
  AnimatedFeatureCard, 
  AnimatedStatusBadge, 
  AnimatedStep,
  AnimatedFAB 
} from '@/components/ui/enhanced-components'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Animated 2025 Header */}
      <AnimatedHeader>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <AnimatedLogo />
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-8">
                <AnimatedNavItem href="#features">Features</AnimatedNavItem>
                <AnimatedNavItem href="#pricing">Pricing</AnimatedNavItem>
                <AnimatedNavItem href="#about">About</AnimatedNavItem>
              </nav>
              <AuthButton />
            </div>
          </div>
        </div>
      </AnimatedHeader>

      <main>
        {/* Hero Section - 2025 Style */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <AnimatedStatusBadge 
                variant="secondary" 
                className="bg-orange-50 text-orange-700 border-orange-200 mb-8"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">New: AI-powered lesson planning</span>
                </div>
              </AnimatedStatusBadge>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
                Launch your tutoring business in{' '}
                <span className="text-gradient">days, not months</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Built for tutors, solo creators, and lean teams who need to launch fast, look polished, 
                and make a bold impression from day one.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <AnimatedButton 
                  variant="primary" 
                  size="lg" 
                  className="text-lg px-8 py-4"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </AnimatedButton>
                <AnimatedButton 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4"
                >
                  Watch Demo
                </AnimatedButton>
              </div>
              
              {/* Social Proof */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Clean 2025 Design */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-slate-700 font-medium">Benefits</span>
              </div>
              <h2 className="text-5xl font-bold mb-6">
                Build smarter sites, faster
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Pre-optimized templates and AI tools that help tutors launch bold, client-winning sites without the usual grind.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <AnimatedFeatureCard
                icon={Brain}
                title="AI Site Builder"
                description="Instantly generate layouts, sections and content so you can launch in minutes not days."
              />

              <AnimatedFeatureCard
                icon={Users}
                title="Founder-Ready Templates"
                description="Built for tutoring services, pricing pages, launches, and case studies everything a tutor needs to go live."
              />

              <AnimatedFeatureCard
                icon={Zap}
                title="Portfolio Pages in Seconds"
                description="Highlight your expertise, projects, or case studies fast with layouts designed to impress and convert."
              />
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-6">
                  <Brain className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-700 font-medium">AI-driven features</span>
                </div>
                <h2 className="text-5xl font-bold mb-6">
                  Instant site setup, powered by AI
                </h2>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  Launch a beautiful, high-converting site in minutes using smart layout and copy tools built specifically for tutors.
                </p>
                <AnimatedButton variant="outline">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </AnimatedButton>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="flex items-center space-x-2 mt-6">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">AI Assistant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-4 py-2 mb-6">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-slate-700 font-medium">How it works</span>
              </div>
              <h2 className="text-5xl font-bold mb-6">How it works</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                A smooth 3-step process to get your tutoring site live
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <AnimatedStep
                step={1}
                title="Pick a template"
                description="Clean, confident. Sets the foundation with minimal words."
                isActive={true}
              />
              
              <AnimatedStep
                step={2}
                title="Customize with AI"
                description="Direct and modern clearly shows value and tech power."
              />
              
              <AnimatedStep
                step={3}
                title="Launch your site"
                description="Clear and motivating focused on action and result."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl font-bold mb-6">
                Ready to launch your tutoring business?
              </h2>
              <p className="text-xl text-slate-600 mb-12">
                Join thousands of tutors who are already growing their practice with Mentoblo. 
                Start your free trial today and see the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AnimatedButton 
                  variant="primary" 
                  size="lg" 
                  className="text-lg px-8 py-4"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </AnimatedButton>
                <AnimatedButton 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4"
                >
                  Schedule Demo
                </AnimatedButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <AnimatedFAB onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <ArrowRight className="w-6 h-6 rotate-90" />
      </AnimatedFAB>

      {/* Clean 2025 Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold">Mentoblo</span>
              </div>
              <p className="text-slate-400 mb-6">
                AI-powered tutoring platform designed to help tutors launch stunning sites effortlessly and fast.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">404</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-slate-400 mb-4">Get tips, product updates, and insights on working smarter with AI.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Button className="bg-orange-500 hover:bg-orange-600 rounded-l-none rounded-r-lg">
                  Sub
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Mentoblo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}