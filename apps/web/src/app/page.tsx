import { AuthButton } from '@/components/auth/auth-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Star, Users, Zap, Brain, Shield, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold text-gradient">Mentoblo</span>
            </div>
            <div className="flex items-center space-x-4">
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-5xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  <Star className="w-3 h-3 mr-1" />
                  Trusted by 10,000+ tutors
                </Badge>
                <span className="text-sm text-muted-foreground">Join the revolution</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-slide-up">
                <span className="text-gradient">Transform</span> your tutoring business with{' '}
                <span className="text-slate-900">AI-powered tools</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
                The all-in-one platform that automates admin tasks, grows your client base, 
                and helps you teach smarter. Focus on what you love—teaching.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in">
                <Button size="lg" className="text-lg px-8 py-6 h-auto gradient-primary hover:opacity-90 transition-all duration-300 shadow-xl">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto border-2 hover:bg-slate-50 transition-all duration-300">
                  Watch Demo
                </Button>
              </div>
              
              {/* Social Proof */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500 animate-fade-in">
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

        {/* Features Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Everything you need to <span className="text-gradient">scale your practice</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Powerful tools designed specifically for independent tutors who want to grow their business
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-3">Smart Client Management</CardTitle>
                  <CardDescription className="text-base">
                    Organize students, track progress, and manage schedules with AI-powered insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Automated scheduling & reminders</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Progress tracking & analytics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Communication history</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 gradient-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-3">Automated Admin</CardTitle>
                  <CardDescription className="text-base">
                    Reduce paperwork by 90% with smart automation and AI-powered workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Auto-generated invoices</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Payment processing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Tax reporting & compliance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-3">AI Teaching Assistant</CardTitle>
                  <CardDescription className="text-base">
                    Enhance your teaching with personalized lesson plans and student insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Personalized lesson plans</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Student performance analysis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Resource recommendations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="animate-fade-in">
                <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
                <div className="text-lg opacity-90">Active Tutors</div>
              </div>
              <div className="animate-fade-in">
                <div className="text-4xl md:text-5xl font-bold mb-2">50,000+</div>
                <div className="text-lg opacity-90">Students Helped</div>
              </div>
              <div className="animate-fade-in">
                <div className="text-4xl md:text-5xl font-bold mb-2">$2M+</div>
                <div className="text-lg opacity-90">Revenue Generated</div>
              </div>
              <div className="animate-fade-in">
                <div className="text-4xl md:text-5xl font-bold mb-2">4.9/5</div>
                <div className="text-lg opacity-90">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to <span className="text-gradient">transform</span> your tutoring business?
              </h2>
              <p className="text-xl text-slate-600 mb-12">
                Join thousands of tutors who are already growing their practice with Mentoblo. 
                Start your free trial today and see the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6 h-auto gradient-primary hover:opacity-90 transition-all duration-300 shadow-xl">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto border-2 hover:bg-slate-50 transition-all duration-300">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-2xl font-bold">Mentoblo</span>
              </div>
              <p className="text-slate-400 mb-6">
                Empowering tutors to teach smarter and grow their business with AI-powered tools.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
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
