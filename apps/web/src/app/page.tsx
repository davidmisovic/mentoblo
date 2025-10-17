'use client'

import { AuthButton } from '@/components/auth/auth-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Star, Users, Zap, Brain, Shield, Globe, Sparkles, TrendingUp, Calendar, CreditCard, BookOpen, Video, Facebook, Twitter, Linkedin, Instagram, Check, Menu } from 'lucide-react'
import { useState } from 'react'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">Mentoblo</span>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
                Contact
              </a>
            </div>

            {/* CTA buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button variant="default" size="sm">
                Start Free Trial
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-border animate-fade-in">
              <a href="#features" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#about" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
              <a href="#contact" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                Contact
              </a>
              <div className="pt-4 space-y-2">
                <Button variant="ghost" size="sm" className="w-full">
                  Sign In
                </Button>
                <Button variant="default" size="sm" className="w-full">
                  Start Free Trial
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/30">
          {/* Background gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-glow-pulse" />
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
              {/* Content */}
              <div className="space-y-8 animate-fade-in-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">The All-in-One Platform for Tutors</span>
                </div>

                {/* Main headline */}
                <h1 className="text-5xl lg:text-6xl xl:text-7xl leading-tight">
                  Build Your
                  <span className="text-gradient block mt-2">
                    Teaching Empire
                  </span>
                  in One Place
                </h1>

                {/* Subheadline */}
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Mentoblo liberates independent tutors and coaches from administrative chaos. Win clients, automate everything, and teach smarter with AI.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="default" className="group">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline">
                    See How It Works
                  </Button>
                </div>

                {/* Social proof */}
                <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Active Tutors</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-3xl font-bold text-secondary">10k+</div>
                    <div className="text-sm text-muted-foreground">Lessons Delivered</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-3xl font-bold text-accent">98%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative animate-fade-in mt-16 w-full max-w-4xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl animate-glow-pulse" />
                <div className="relative rounded-3xl shadow-2xl hover-lift w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-muted-foreground">Hero Image Placeholder</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Three Pillars Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            {/* Section header */}
            <div className="text-center space-y-4 mb-16 animate-fade-in-up">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Three Pillars of
                <span className="text-gradient"> Your Success</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to build a professional and prosperous solo teaching business
              </p>
            </div>

            {/* Pillars grid */}
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
                  gradient: "from-primary to-primary/60"
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
                  gradient: "from-secondary to-secondary/60"
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
                  gradient: "from-accent to-accent/60"
                }
              ].map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <Card
                    key={pillar.title}
                    className="p-8 hover-lift bg-card border-2 hover:border-primary/30 transition-all group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Icon with gradient background */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title & description */}
                    <h3 className="text-2xl font-bold mb-2">{pillar.title}</h3>
                    <p className="text-muted-foreground mb-6">{pillar.description}</p>

                    {/* Features list */}
                    <ul className="space-y-3">
                      {pillar.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            {/* Section header */}
            <div className="text-center space-y-4 mb-16 animate-fade-in-up">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Everything You Need,
                <span className="text-gradient"> Nothing You Don&apos;t</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Stop juggling 5-7 different tools. Mentoblo brings everything together in one elegant platform.
              </p>
            </div>

            {/* Features grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Calendar,
                  title: "Intelligent Scheduling",
                  description: "Two-way sync with Google/Outlook. Set your availability once and let clients book instantly.",
                },
                {
                  icon: Users,
                  title: "Complete Student CRM",
                  description: "Track every student&apos;s progress, notes, payment history, and materials in one place.",
                },
                {
                  icon: CreditCard,
                  title: "Stripe Integration",
                  description: "Accept payments, generate invoices, and track revenue automatically with Stripe Connect.",
                },
                {
                  icon: Video,
                  title: "Virtual Classroom",
                  description: "Integrated video calls with real-time shared notes that auto-save to each session.",
                },
                {
                  icon: BookOpen,
                  title: "Materials Library",
                  description: "Centralized storage for all your teaching materials, easily shareable with students.",
                },
                {
                  icon: Brain,
                  title: "AI Powered Tools",
                  description: "Generate lesson plans, parent reports, and professional communications with AI assistance.",
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group p-8 rounded-2xl border-2 border-border hover:border-primary/30 bg-card hover-lift transition-all"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Main CTA card */}
              <div className="rounded-3xl border-2 border-primary/20 bg-card/80 backdrop-blur-sm p-12 shadow-2xl">
                <div className="text-center space-y-6">
                  {/* Headline */}
                  <h2 className="text-4xl lg:text-5xl font-bold">
                    Ready to Build Your
                    <span className="text-gradient"> Teaching Empire?</span>
                  </h2>

                  {/* Subheadline */}
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Join hundreds of tutors who&apos;ve transformed their solo practice into a thriving business with Mentoblo.
                  </p>

                  {/* Benefits checklist */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span>14-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span>Cancel anytime</span>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" variant="default" className="group">
                      Start Your Free Trial
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button size="lg" variant="outline">
                      Schedule a Demo
                    </Button>
                  </div>

                  {/* Trust badge */}
                  <p className="text-sm text-muted-foreground pt-4">
                    Trusted by 500+ independent tutors and coaches worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold">Mentoblo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The all-in-one platform for independent tutors and coaches.
              </p>
              {/* Social links */}
              <div className="flex gap-4">
                <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product column */}
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Use Cases</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support column */}
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API Reference</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Mentoblo. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}