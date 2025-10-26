'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Target, 
  Rocket, 
  Layers, 
  Calendar, 
  Users, 
  Globe, 
  CreditCard, 
  CalendarCheck, 
  DollarSign, 
  Presentation, 
  Library, 
  Bot, 
  Wand2, 
  FileSignature, 
  MailQuestion, 
  Settings, 
  Feather, 
  Shield, 
  Brain, 
  Zap, 
  Flag, 
  Ban, 
  User, 
  PlayCircle, 
  Sparkles, 
  BookOpen, 
  Send, 
  CheckCircle, 
  Star, 
  LogIn, 
  ExternalLink, 
  ShieldCheck, 
  Inbox, 
  FileText, 
  UserPlus, 
  Copy, 
  MoreHorizontal, 
  RefreshCw, 
  BarChart3, 
  LayoutDashboard, 
  Video, 
  File, 
  Folder, 
  Clock, 
  CalendarPlus, 
  Plus, 
  TrendingUp, 
  Twitter, 
  Github 
} from 'lucide-react';

const MentobloLanding = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  useEffect(() => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }
  }, []);

  // Check authentication status
  useEffect(() => {
    console.log('=== MAIN PAGE AUTH CHECK ===');
    console.log('Current URL:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    
    // Prevent any redirects if we're on the main page
    if (window.location.pathname !== '/') {
      console.log('Not on main page, skipping auth check');
      return;
    }
    
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check:', !!session);
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('=== AUTH STATE CHANGE ===');
      console.log('Event:', event);
      console.log('Has session:', !!session);
      console.log('Current pathname:', window.location.pathname);
      console.log('Is authenticated state:', isAuthenticated);
      
      // Only redirect if we're still on the main page
      if (window.location.pathname !== '/') {
        console.log('Not on main page, skipping redirect');
        return;
      }
      
      // Update state immediately
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      console.log('Updated isAuthenticated to:', isAuth);
      
      if (session && window.location.pathname === '/') {
        console.log('✅ User authenticated on main page - waiting for session to be fully established');
        // Wait longer for session to be fully established
        setTimeout(() => {
          console.log('Redirecting to dashboard after session establishment delay');
          window.location.href = '/dashboard';
        }, 1000);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Handle OAuth callback with access token in URL fragment
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if we have an access token in the URL fragment
      const hash = window.location.hash;
      console.log('=== OAuth Callback Debug ===');
      console.log('Current URL:', window.location.href);
      console.log('Hash:', hash);
      console.log('Pathname:', window.location.pathname);
      
      if (hash.includes('access_token=')) {
        console.log('OAuth tokens detected, processing...');
        try {
          // Extract the access token from the URL fragment
          const urlParams = new URLSearchParams(hash.substring(1));
          const accessToken = urlParams.get('access_token');
          const refreshToken = urlParams.get('refresh_token');
          const expiresIn = urlParams.get('expires_in');
          
          console.log('Tokens extracted:', { 
            accessToken: !!accessToken, 
            refreshToken: !!refreshToken,
            expiresIn 
          });
          
          if (accessToken && refreshToken) {
            console.log('Setting session with tokens...');
            // Set the session using the tokens
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            console.log('Session set result:', { 
              hasSession: !!data.session, 
              hasUser: !!data.user,
              error: error?.message 
            });
            
            if (!error && data.session) {
              console.log('Session established successfully!');
              console.log('User:', data.user?.email);
              
              // Clear the URL fragment immediately
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // Force redirect to dashboard
              console.log('Forcing redirect to dashboard...');
              window.location.href = '/dashboard';
              
            } else {
              console.error('Error setting session:', error);
              console.log('Redirecting to signin with error');
              window.location.href = '/signin?error=auth_failed';
            }
          } else {
            console.log('Missing required tokens');
            window.location.href = '/signin?error=missing_tokens';
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          window.location.href = '/signin?error=callback_error';
        }
      } else {
        console.log('No OAuth tokens found in URL');
      }
    };

    // Run immediately
    handleOAuthCallback();
  }, []);

  return (
    <div className="antialiased bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-neutral-200/70">
        <div className="mx-auto max-w-7xl px-6">
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
              <a href="#pricing" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Pricing</a>
              <a href="#contact" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Contact</a>
            </nav>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <a href="/dashboard" className="inline-flex items-center gap-2 rounded-md border border-transparent bg-neutral-900 px-3.5 py-2 text-[14px] font-medium text-white hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 transition">
                  Dashboard
                </a>
              ) : (
                <>
                  <a href="/signin" className="hidden sm:inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3.5 py-2 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 transition">
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </a>
                  <a href="/signup" className="inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-3.5 py-2 text-[14px] font-medium text-white hover:bg-neutral-800 hover:border-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 transition">
                    <Sparkles className="h-4 w-4" />
                    Get started
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-4 pb-2 md:pt-5 md:pb-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="lg:pt-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[12px] text-neutral-700 shadow-sm">
                <Target className="h-3.5 w-3.5" />
                Purpose-built for independent tutors
              </div>
              <h1 className="mt-4 text-4xl md:text-5xl tracking-tight font-semibold text-neutral-900">
                Mentoblo — Focus on Your Students. We'll Handle the Rest.
              </h1>
              <p className="mt-4 text-[16px] md:text-[17px] leading-7 text-neutral-700">
                Mentoblo replaces your 5+ tools with one elegant OS. We helps you win clients, automate admin, and teach smarter with AI.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="/signup" className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2.5 text-[14px] font-medium text-white hover:bg-neutral-800 hover:border-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 transition">
                  <Rocket className="h-4.5 w-4.5" />
                  Start free
                </a>
                <a href="#pillars" className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 transition">
                  <Layers className="h-4.5 w-4.5" />
                  Explore the pillars
                </a>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=200&auto=format&fit=crop" alt="Tutor" className="h-8 w-8 rounded-full ring-2 ring-white border border-neutral-200 object-cover" />
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" alt="Tutor" className="h-8 w-8 rounded-full ring-2 ring-white border border-neutral-200 object-cover" />
                  <img src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop" alt="Tutor" className="h-8 w-8 rounded-full ring-2 ring-white border border-neutral-200 object-cover" />
                </div>
                <p className="text-[13px] text-neutral-600">
                  Loved by independent tutors and small teams
                </p>
              </div>
            </div>

            {/* Product Preview Card */}
            <div className="relative">
              <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/60 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-400"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <span className="text-[12px] text-neutral-600">Command Center</span>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-lg border border-neutral-200 p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-neutral-600">This month</span>
                            <TrendingUp className="h-4 w-4 text-neutral-500" />
                          </div>
                          <p className="mt-1 text-2xl tracking-tight font-semibold">$2,840</p>
                          <p className="text-[12px] text-emerald-600 mt-1 inline-flex items-center gap-1">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M7 7h10v10M7 17L17 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                            </svg>
                            +14%
                          </p>
                        </div>
                        <div className="rounded-lg border border-neutral-200 p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-neutral-600">New leads</span>
                            <Inbox className="h-4 w-4 text-neutral-500" />
                          </div>
                          <p className="mt-1 text-2xl tracking-tight font-semibold">19</p>
                          <p className="text-[12px] text-neutral-600 mt-1">Conversion 42%</p>
                        </div>
                        <div className="rounded-lg border border-neutral-200 p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-neutral-600">Upcoming</span>
                            <Calendar className="h-4 w-4 text-neutral-500" />
                          </div>
                          <p className="mt-1 text-2xl tracking-tight font-semibold">7 lessons</p>
                          <p className="text-[12px] text-neutral-600 mt-1">Next in 45m</p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-neutral-200">
                        <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-neutral-600" />
                            <span className="text-[13px] text-neutral-700">Recent activity</span>
                          </div>
                          <button className="text-[12px] text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-1">
                            <RefreshCw className="h-3.5 w-3.5" /> Refresh
                          </button>
                        </div>
                        <ul className="divide-y divide-neutral-200">
                          <li className="flex items-center justify-between px-3 py-2.5">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                                <CreditCard className="h-4 w-4 text-emerald-600" />
                              </div>
                              <div>
                                <p className="text-[13px] text-neutral-900">Payment received • $60</p>
                                <p className="text-[12px] text-neutral-600">From Sarah's parent</p>
                              </div>
                            </div>
                            <span className="text-[12px] text-neutral-500">2m ago</span>
                          </li>
                          <li className="flex items-center justify-between px-3 py-2.5">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                                <UserPlus className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-[13px] text-neutral-900">New lead booked consultation</p>
                                <p className="text-[12px] text-neutral-600">Marco, Tuesday 10:00</p>
                              </div>
                            </div>
                            <span className="text-[12px] text-neutral-500">15m ago</span>
                          </li>
                          <li className="flex items-center justify-between px-3 py-2.5">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                                <FileText className="h-4 w-4 text-violet-600" />
                              </div>
                              <div>
                                <p className="text-[13px] text-neutral-900">Invoice sent • Lesson #182</p>
                                <p className="text-[12px] text-neutral-600">Peter • English B1</p>
                              </div>
                            </div>
                            <span className="text-[12px] text-neutral-500">1h ago</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Mini Calendar */}
                    <div className="space-y-4">
                      <div className="rounded-lg border border-neutral-200 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-neutral-600">Availability</span>
                          <Clock className="h-4 w-4 text-neutral-500" />
                        </div>
                        <div className="mt-2 grid grid-cols-7 gap-1.5">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                            <span key={i} className="text-[10px] text-neutral-500 text-center">{day}</span>
                          ))}
                        </div>
                        <div className="mt-2 grid grid-cols-7 gap-1.5">
                          <div className="h-8 w-full rounded border border-neutral-200 grid place-items-center text-[12px] text-neutral-700">9</div>
                          <div className="h-8 w-full rounded border border-neutral-200 bg-emerald-50 text-emerald-800 grid place-items-center text-[12px]">10</div>
                          <div className="h-8 w-full rounded border border-neutral-200 grid place-items-center text-[12px] text-neutral-700">11</div>
                          <div className="h-8 w-full rounded border border-neutral-200 grid place-items-center text-[12px] text-neutral-700">12</div>
                          <div className="h-8 w-full rounded border border-neutral-200 bg-emerald-50 text-emerald-800 grid place-items-center text-[12px]">13</div>
                          <div className="h-8 w-full rounded border border-neutral-200 grid place-items-center text-[12px] text-neutral-700">14</div>
                          <div className="h-8 w-full rounded border border-neutral-200 grid place-items-center text-[12px] text-neutral-700">15</div>
                        </div>
                        <a href="/booking" className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-[13px] font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 transition">
                          <CalendarPlus className="h-4 w-4" />
                          Open booking page
                        </a>
                      </div>

                      <div className="rounded-lg border border-neutral-200 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-neutral-600">Materials Library</span>
                          <Folder className="h-4 w-4 text-neutral-500" />
                        </div>
                        <ul className="mt-2 space-y-2">
                          <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <File className="h-4 w-4 text-neutral-500" />
                              <span className="text-[13px] text-neutral-800">B1 Past Simple.pdf</span>
                            </div>
                            <span className="text-[12px] text-neutral-500">2.1 MB</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-neutral-500" />
                              <span className="text-[13px] text-neutral-800">Dialogue practice.mov</span>
                            </div>
                            <span className="text-[12px] text-neutral-500">38 MB</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-neutral-500" />
                              <span className="text-[13px] text-neutral-800">Worksheet 12.docx</span>
                            </div>
                            <span className="text-[12px] text-neutral-500">310 KB</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50/70 px-3 py-2.5 text-[12px] text-neutral-700">
                    Stripe payments, calendar sync, and shared notes all in one place.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section id="why" className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-neutral-200 p-6 bg-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] text-neutral-700">
                <Flag className="h-3.5 w-3.5" /> Our Mission
              </div>
              <h3 className="mt-3 text-xl tracking-tight font-semibold">Liberate tutors from administrative chaos</h3>
              <p className="mt-2 text-[14px] text-neutral-700">
                Equip tutors to build a confident, elegant solo business — focused on teaching, not juggling tools.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 p-6 bg-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] text-neutral-700">
                <Ban className="h-3.5 w-3.5" /> The Problem We Solve
              </div>
              <h3 className="mt-3 text-xl tracking-tight font-semibold">The chaos of glued-together tools</h3>
              <p className="mt-2 text-[14px] text-neutral-700">
                Website, calendar, invoicing, calls, notes, CRM — scattered apps that don't talk to each other. Lost time and lost trust.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 p-6 bg-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] text-neutral-700">
                <User className="h-3.5 w-3.5" /> Our Hero
              </div>
              <h3 className="mt-3 text-xl tracking-tight font-semibold">Independent tutors and small teams</h3>
              <p className="mt-2 text-[14px] text-neutral-700">
                Not large schools. Individuals who need help with everything besides teaching: marketing, sales, admin, invoicing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Pillars */}
      <section id="pillars" className="border-t border-neutral-200 bg-neutral-50/40">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl tracking-tight font-semibold">The three pillars</h2>
            <p className="mt-2 text-[16px] text-neutral-700">Everything in Mentoblo ladders up to growth, operations, or AI leverage.</p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] text-neutral-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Pillar 1
                </div>
                <TrendingUp className="h-5 w-5 text-neutral-500" />
              </div>
              <h3 className="mt-3 text-[20px] tracking-tight font-semibold">The Growth Engine</h3>
              <p className="mt-2 text-[14px] text-neutral-700">Get more clients with a professional storefront and instant bookings.</p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                    <Globe className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Professional Public Page</p>
                    <p className="text-[13px] text-neutral-600">SEO-friendly profile at mentoblo.app/t/your-profile with bio, specialties, testimonials, pricing.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                    <CalendarCheck className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Integrated Booking & Payments</p>
                    <p className="text-[13px] text-neutral-600">Real-time availability with instant booking of consultations or lessons — pay upfront.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                    <LayoutDashboard className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Lead Mini-CRM</p>
                    <p className="text-[13px] text-neutral-600">Track every booking from new inquiry to paying student, in one simple pipeline.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] text-neutral-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  Pillar 2
                </div>
                <LayoutDashboard className="h-5 w-5 text-neutral-500" />
              </div>
              <h3 className="mt-3 text-[20px] tracking-tight font-semibold">The Operating System</h3>
              <p className="mt-2 text-[14px] text-neutral-700">Automate scheduling, invoicing, and student management in one place.</p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                    <BarChart3 className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Command Center Dashboard</p>
                    <p className="text-[13px] text-neutral-600">Upcoming lessons, revenue overview, recent activity — always in view.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                    <Calendar className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Intelligent Calendar & Scheduling</p>
                    <p className="text-[13px] text-neutral-600">Two-way sync with Google/Outlook. Offer only real, conflict-free slots.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                    <User className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Complete Student Management</p>
                    <p className="text-[13px] text-neutral-600">Profiles with notes, history, attendance, payment status, and shared materials.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                    <DollarSign className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Automated Invoicing & Payments</p>
                    <p className="text-[13px] text-neutral-600">Stripe Connect, one-click invoices, automatic payment detection and status updates.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                    <Presentation className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Virtual Classroom & Shared Notes</p>
                    <p className="text-[13px] text-neutral-600">Session page with Meet/Zoom link and autosaved real-time notes per lesson.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                    <Library className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Materials Library</p>
                    <p className="text-[13px] text-neutral-600">Upload PDFs, videos, worksheets and share with students or assign to courses.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div id="ai" className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] text-neutral-700">
                  <span className="h-2 w-2 rounded-full bg-violet-600"></span>
                  Pillar 3
                </div>
                <Bot className="h-5 w-5 text-neutral-500" />
              </div>
              <h3 className="mt-3 text-[20px] tracking-tight font-semibold">The AI Copilot - coming soon</h3>
              <p className="mt-2 text-[14px] text-neutral-700">Save time and elevate quality — powered by advanced models.</p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                    <Wand2 className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">AI Lesson Planner</p>
                    <p className="text-[13px] text-neutral-600">Instant 60-minute plans with objectives, activities, and exercises.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                    <FileSignature className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">AI Parent Report Generator</p>
                    <p className="text-[13px] text-neutral-600">Turn bullet notes into clear, positive, professional updates for parents.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md border border-neutral-200 bg-white grid place-items-center">
                    <MailQuestion className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">AI Communication Assistant</p>
                    <p className="text-[13px] text-neutral-600">Draft payment reminders, price updates, and sensitive messages in seconds.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Pillar Previews */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Growth Preview */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-neutral-600">Public Profile & Booking</span>
                <ExternalLink className="h-4 w-4 text-neutral-500" />
              </div>
              <div className="mt-3 rounded-lg border border-neutral-200 overflow-hidden">
                <img src="https://id-preview--7b9e3fd5-ea22-464b-b2bc-c762c7a18989.lovable.app/assets/hero-image-LhWo51nP.jpg" alt="Public page preview" className="h-40 w-full object-cover" />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-medium text-neutral-900 tracking-tight">Example: Jane Smith — English Tutor</p>
                      <p className="text-[12px] text-neutral-600">Cambridge C2 • Exam prep • Conversation</p>
                    </div>
                    <a href="/book" className="rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-[12px] font-medium hover:bg-neutral-50">Book</a>
                  </div>
                </div>
              </div>
            </div>

            {/* OS Preview */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-neutral-600">Scheduling & Payments</span>
                <ShieldCheck className="h-4 w-4 text-neutral-500" />
              </div>
              <div className="mt-3 rounded-lg border border-neutral-200 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md border border-neutral-200 grid place-items-center">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-neutral-900">Invoice #184 • $60</p>
                    <p className="text-[12px] text-neutral-600">Awaiting payment</p>
                  </div>
                  <button className="rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-[12px] font-medium hover:bg-neutral-50">Send</button>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md border border-neutral-200 grid place-items-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-neutral-900">Wed, 13:00–14:00</p>
                    <p className="text-[12px] text-neutral-600">Offered automatically from availability</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Preview */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-neutral-600">AI Copilot - coming soon</span>
                <Sparkles className="h-4 w-4 text-neutral-500" />
              </div>
              <div className="mt-3 rounded-lg border border-neutral-200 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md border border-neutral-200 grid place-items-center">
                    <Wand2 className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-[13px] text-neutral-900">English, Past Simple, B1</p>
                    <p className="text-[12px] text-neutral-600">Plan generated in 2.1s</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-2">
                  <li className="text-[12px] text-neutral-700">Objectives: usage, form, pronunciation</li>
                  <li className="text-[12px] text-neutral-700">Activities: warm-up, timeline drill, dialogue</li>
                  <li className="text-[12px] text-neutral-700">Exercises: gap-fill, role-play, mini quiz</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Features: Operating System */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] text-neutral-700">
                <LayoutDashboard className="h-3.5 w-3.5" /> The Operating System
              </div>
              <h3 className="mt-3 text-3xl tracking-tight font-semibold">Run the entire business from one command center</h3>
              <p className="mt-3 text-[15px] text-neutral-700">
                A single, coherent system for scheduling, student records, and payments — with reliable automations that reduce admin to minutes.
              </p>
              <ul className="mt-5 space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Two-way calendar sync</p>
                    <p className="text-[13px] text-neutral-600">Integrates with Google and Outlook to eliminate conflicts.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Stripe-powered billing</p>
                    <p className="text-[13px] text-neutral-600">Upfront payments at booking, one-click invoices after lessons, automatic tracking via webhooks.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Session notes that stick</p>
                    <p className="text-[13px] text-neutral-600">Shared notes are autosaved to each lesson and visible to the right student.</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 flex gap-3">
                <a href="/scheduling" className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 transition">
                  <Calendar className="h-4 w-4" />
                  See scheduling
                </a>
                <a href="/invoicing" className="inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-3.5 py-2.5 text-[14px] font-medium text-white hover:bg-neutral-800 hover:border-neutral-800 transition">
                  <CreditCard className="h-4 w-4" />
                  Try invoicing
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-neutral-600" />
                  <span className="text-[13px] text-neutral-700">Students</span>
                </div>
                <a href="/students/new" className="text-[12px] text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add
                </a>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-neutral-200 p-3">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=200&auto=format&fit=crop" className="h-9 w-9 rounded-full border border-neutral-200 object-cover" alt="Student" />
                    <div className="flex-1">
                      <p className="text-[13px] text-neutral-900">Sarah Chen</p>
                      <p className="text-[12px] text-neutral-600">English • B2</p>
                    </div>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5">Paid</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-[12px] text-neutral-600">
                    <Calendar className="h-4 w-4" /> Thu 16:00
                    <FileText className="h-4 w-4 ml-2" /> 12 lessons
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-200 p-3">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=200&auto=format&fit=crop" className="h-9 w-9 rounded-full border border-neutral-200 object-cover" alt="Student" />
                    <div className="flex-1">
                      <p className="text-[13px] text-neutral-900">Marco Díaz</p>
                      <p className="text-[12px] text-neutral-600">English • B1</p>
                    </div>
                    <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">Due</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-[12px] text-neutral-600">
                    <Calendar className="h-4 w-4" /> Tue 10:00
                    <FileText className="h-4 w-4 ml-2" /> 5 lessons
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-200 p-3">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=200&auto=format&fit=crop" className="h-9 w-9 rounded-full border border-neutral-200 object-cover" alt="Student" />
                    <div className="flex-1">
                      <p className="text-[13px] text-neutral-900">Peter Novak</p>
                      <p className="text-[12px] text-neutral-600">Pronunciation • A2</p>
                    </div>
                    <span className="text-[11px] text-neutral-700 bg-neutral-50 border border-neutral-200 rounded px-1.5 py-0.5">Scheduled</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-[12px] text-neutral-600">
                    <Calendar className="h-4 w-4" /> Fri 11:30
                    <FileText className="h-4 w-4 ml-2" /> 8 lessons
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Features: Growth Engine */}
      <section className="border-t border-neutral-200 bg-neutral-50/40">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Visual */}
            <div className="order-2 lg:order-1">
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-neutral-600" />
                    <span className="text-[13px] text-neutral-700">mentoblo.app/t/your-profile</span>
                  </div>
                  <button className="text-[12px] text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-1">
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1400&auto=format&fit=crop" className="h-56 w-full object-cover rounded-lg border border-neutral-200" alt="Tutor public page" />
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-neutral-200 p-3">
                      <p className="text-[13px] text-neutral-900">Intro consultation</p>
                      <p className="text-[12px] text-neutral-600">30 min • $0</p>
                      <a href="/book/consultation" className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-[12px] font-medium hover:bg-neutral-50 inline-flex items-center justify-center">Book</a>
                    </div>
                    <div className="rounded-lg border border-neutral-200 p-3">
                      <p className="text-[13px] text-neutral-900">Lesson — 60 minutes</p>
                      <p className="text-[12px] text-neutral-600">$60</p>
                      <a href="/book/lesson" className="mt-2 w-full rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-[12px] font-medium hover:bg-neutral-50 inline-flex items-center justify-center">Book</a>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50/70 px-3 py-2.5 text-[12px] text-neutral-700">
                  New bookings appear as leads you can track to conversion.
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] text-neutral-700">
                <Rocket className="h-3.5 w-3.5" /> The Growth Engine
              </div>
              <h3 className="mt-3 text-3xl tracking-tight font-semibold">Turn your profile into a client-winning storefront</h3>
              <p className="mt-3 text-[15px] text-neutral-700">
                Replace "email me to book" with instant scheduling and upfront payments. Present a polished brand with testimonials and pricing that inspire confidence.
              </p>
              <ul className="mt-5 space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">SEO-friendly and shareable</p>
                    <p className="text-[13px] text-neutral-600">Appears great on search and social; simple link that converts.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Real-time availability</p>
                    <p className="text-[13px] text-neutral-600">Only offer slots you can actually teach — automatically.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">Lead pipeline</p>
                    <p className="text-[13px] text-neutral-600">Every booking becomes a trackable lead to convert into a student.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Features: AI Copilot */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] text-neutral-700">
                <Bot className="h-3.5 w-3.5" /> The AI Copilot - coming soon
              </div>
              <h3 className="mt-3 text-3xl tracking-tight font-semibold">Ship quality faster — plans, reports, and emails in seconds</h3>
              <p className="mt-3 text-[15px] text-neutral-700">
                Capture a few inputs and let AI draft the heavy lifting. You keep the expertise; Mentoblo removes the busywork.
              </p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-neutral-200 p-3">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-violet-600" />
                    <p className="text-[13px] text-neutral-900">Lesson Planner</p>
                  </div>
                  <p className="mt-1 text-[12px] text-neutral-600">Generate a 60-minute plan from topic + level.</p>
                </div>
                <div className="rounded-lg border border-neutral-200 p-3">
                  <div className="flex items-center gap-2">
                    <FileSignature className="h-4 w-4 text-violet-600" />
                    <p className="text-[13px] text-neutral-900">Parent Reports</p>
                  </div>
                  <p className="mt-1 text-[12px] text-neutral-600">Turn bullets into professional updates post-lesson.</p>
                </div>
                <div className="rounded-lg border border-neutral-200 p-3">
                  <div className="flex items-center gap-2">
                    <MailQuestion className="h-4 w-4 text-violet-600" />
                    <p className="text-[13px] text-neutral-900">Communication Assistant</p>
                  </div>
                  <p className="mt-1 text-[12px] text-neutral-600">Draft reminders, increases, and sensitive messages.</p>
                </div>
                <div className="rounded-lg border border-neutral-200 p-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-violet-600" />
                    <p className="text-[13px] text-neutral-900">Tunable tone</p>
                  </div>
                  <p className="mt-1 text-[12px] text-neutral-600">Professional, positive, and on-brand by default.</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <a href="/ai" className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 transition">
                  <PlayCircle className="h-4 w-4" />
                  See it in action
                </a>
                <a href="/ai/lesson-planner" className="inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-3.5 py-2.5 text-[14px] font-medium text-white hover:bg-neutral-800 hover:border-neutral-800 transition">
                  <Sparkles className="h-4 w-4" />
                  Generate a plan
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-lg border border-neutral-200 p-3">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-violet-600" />
                    <span className="text-[13px] text-neutral-700">AI Lesson Planner</span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input className="rounded-md border border-neutral-200 px-2.5 py-2 text-[13px] outline-none focus:ring-2 focus:ring-neutral-900/10" placeholder="Subject (e.g., English)" />
                    <input className="rounded-md border border-neutral-200 px-2.5 py-2 text-[13px] outline-none focus:ring-2 focus:ring-neutral-900/10" placeholder="Topic (e.g., Past Simple)" />
                    <input className="rounded-md border border-neutral-200 px-2.5 py-2 text-[13px] outline-none focus:ring-2 focus:ring-neutral-900/10" placeholder="Level (e.g., B1)" />
                  </div>
                  <a href="/ai/lesson-planner" className="mt-3 inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-[13px] font-medium hover:bg-neutral-50">Generate</a>
                  <div className="mt-3 rounded-md border border-neutral-200 bg-neutral-50/70 p-3">
                    <p className="text-[12px] text-neutral-700">Objectives • Warm-up • Controlled practice • Dialogue • Assessment</p>
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-200 p-3">
                  <div className="flex items-center gap-2">
                    <FileSignature className="h-4 w-4 text-violet-600" />
                    <span className="text-[13px] text-neutral-700">AI Parent Report</span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input className="rounded-md border border-neutral-200 px-2.5 py-2 text-[13px] outline-none focus:ring-2 focus:ring-neutral-900/10" placeholder="Student (e.g., Peter)" />
                    <input className="rounded-md border border-neutral-200 px-2.5 py-2 text-[13px] outline-none focus:ring-2 focus:ring-neutral-900/10" placeholder="Focus (e.g., pronunciation)" />
                  </div>
                  <textarea className="mt-2 w-full rounded-md border border-neutral-200 px-2.5 py-2 text-[13px] outline-none focus:ring-2 focus:ring-neutral-900/10" rows={3} placeholder="Key points (2–3 bullets)"></textarea>
                  <a href="/ai/parent-report" className="mt-3 inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-[13px] font-medium hover:bg-neutral-50">Draft report</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tone of Voice */}
      <section className="border-t border-neutral-200 bg-neutral-50/40">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
          <div className="max-w-2xl">
            <h3 className="text-3xl tracking-tight font-semibold">Our tone of voice</h3>
            <p className="mt-2 text-[15px] text-neutral-700">Professional and intelligent. Empowering. Elegant and simple. Reliable.</p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <Brain className="h-5 w-5 text-neutral-600" />
              <p className="mt-3 text-[14px] font-medium text-neutral-900">Elegant & Simple</p>
              <p className="mt-1 text-[13px] text-neutral-600">Minimal, readable UI with obvious actions.</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <Shield className="h-5 w-5 text-neutral-600" />
              <p className="mt-3 text-[14px] font-medium text-neutral-900">Reliable</p>
              <p className="mt-1 text-[13px] text-neutral-600">Dependable platform for mission-critical work.</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <Zap className="h-5 w-5 text-neutral-600" />
              <p className="mt-3 text-[14px] font-medium text-neutral-900">Empowering</p>
              <p className="mt-1 text-[13px] text-neutral-600">Give tutors superpowers, never overwhelm them.</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <Feather className="h-5 w-5 text-neutral-600" />
              <p className="mt-3 text-[14px] font-medium text-neutral-900">Professional & Intelligent</p>
              <p className="mt-1 text-[13px] text-neutral-600">Clear, precise, and grounded in expertise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
          <div className="max-w-2xl">
            <h3 className="text-3xl md:text-4xl tracking-tight font-semibold">Simple, transparent pricing</h3>
            <p className="mt-2 text-[16px] text-neutral-700">Start free. Upgrade when you're ready. Cancel anytime.</p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] text-neutral-600">Starter</p>
                  <h4 className="mt-1 text-[20px] tracking-tight font-semibold text-neutral-900">For getting started</h4>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl tracking-tight font-semibold text-neutral-900">$0</span>
                <span className="text-[13px] text-neutral-600">/month</span>
              </div>
              <p className="mt-2 text-[13px] text-neutral-600">Test the platform and publish a basic profile.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <span className="text-[13px] text-neutral-700">Public profile & booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <span className="text-[13px] text-neutral-700">Up to 10 students</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <span className="text-[13px] text-neutral-700">5 invoices / month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <span className="text-[13px] text-neutral-700">Materials library • 1 GB</span>
                </li>
              </ul>
              <a href="/signup" className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 transition">
                <Rocket className="h-4 w-4" />
                Get started free
              </a>
            </div>

            {/* Pro */}
            <div className="relative rounded-xl border border-neutral-900 bg-white p-6 shadow-sm flex flex-col">
              <div className="absolute -top-3 left-4">
                <span className="inline-flex items-center gap-1 rounded-full border border-neutral-900 bg-neutral-900 text-white px-2.5 py-1 text-[11px]">
                  <Star className="h-3.5 w-3.5" /> Most popular
                </span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] text-neutral-600">Pro</p>
                  <h4 className="mt-1 text-[20px] tracking-tight font-semibold text-neutral-900">For growing tutors</h4>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl tracking-tight font-semibold text-neutral-900">$19</span>
                <span className="text-[13px] text-neutral-600">/month</span>
              </div>
              <p className="mt-2 text-[13px] text-neutral-600">Everything you need to run a professional solo business.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <span className="text-[13px] text-neutral-700">Everything in Starter</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <span className="text-[13px] text-neutral-700">Unlimited students & invoices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <span className="text-[13px] text-neutral-700">Stripe payments & automations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <span className="text-[13px] text-neutral-700">AI Copilot — planner & reports</span>
                </li>
              </ul>
              <a href="/signup" className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-3.5 py-2.5 text-[14px] font-medium text-white hover:bg-neutral-800 hover:border-neutral-800 transition">
                <Sparkles className="h-4 w-4" />
                Start 14-day trial
              </a>
            </div>

            {/* Team */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] text-neutral-600">Team</p>
                  <h4 className="mt-1 text-[20px] tracking-tight font-semibold text-neutral-900">For small teams</h4>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl tracking-tight font-semibold text-neutral-900">$39</span>
                <span className="text-[13px] text-neutral-600">/seat/month</span>
              </div>
              <p className="mt-2 text-[13px] text-neutral-600">Multi-tutor scheduling, permissions, and shared libraries.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <span className="text-[13px] text-neutral-700">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <span className="text-[13px] text-neutral-700">Shared student records & materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <span className="text-[13px] text-neutral-700">Role-based permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                  <span className="text-[13px] text-neutral-700">Priority support</span>
                </li>
              </ul>
              <a href="#contact" className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 transition">
                <Send className="h-4 w-4" />
                Contact sales
              </a>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3">
            <p className="text-[12px] text-neutral-700">
              All plans include secure hosting, calendar sync, and access to core features. Prices in EUR. Taxes may apply. Save 2 months with yearly billing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h4 className="text-2xl md:text-3xl tracking-tight font-semibold">Win clients, automate admin, teach smarter with AI</h4>
                <p className="mt-2 text-[15px] text-neutral-700">Start building a confident, elegant solo business today.</p>
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <a href="/signup" className="inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2.5 text-[14px] font-medium text-white hover:bg-neutral-800 hover:border-neutral-800 transition">
                    <Rocket className="h-4 w-4" />
                    Get started free
                  </a>
                  <a href="/docs" className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 transition">
                    <BookOpen className="h-4 w-4" />
                    View documentation
                  </a>
                </div>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-5">
                <form id="contact" className="space-y-3">
                  <div>
                    <label className="text-[12px] text-neutral-700">Email</label>
                    <input type="email" className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-neutral-900/10" placeholder="you@school.com" />
                  </div>
                  <div>
                    <label className="text-[12px] text-neutral-700">Team size</label>
                    <input type="text" className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-neutral-900/10" placeholder="1–5" />
                  </div>
                  <button className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 transition">
                    <Send className="h-4 w-4" />
                    Request access
                  </button>
                  <p className="text-[11px] text-neutral-600 text-center">No credit card required</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[8px] border border-neutral-200 bg-white shadow-sm grid place-items-center">
                <span className="text-[13px] font-medium tracking-tight text-neutral-900">M</span>
              </div>
              <span className="text-[14px] font-medium tracking-tight text-neutral-900">Mentoblo</span>
            </div>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a href="#pillars" className="text-[13px] text-neutral-700 hover:text-neutral-900">Product</a>
              <a href="#why" className="text-[13px] text-neutral-700 hover:text-neutral-900">Why Mentoblo</a>
              <a href="#pricing" className="text-[13px] text-neutral-700 hover:text-neutral-900">Pricing</a>
              <a href="/blog" className="text-[13px] text-neutral-700 hover:text-neutral-900">Blog</a>
              <a href="#contact" className="text-[13px] text-neutral-700 hover:text-neutral-900">Contact</a>
              <a href="#" className="text-[13px] text-neutral-700 hover:text-neutral-900">Privacy</a>
              <a href="/terms" className="text-[13px] text-neutral-700 hover:text-neutral-900">Terms</a>
            </nav>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-[12px] text-neutral-600">
              © <span id="year">2025</span> Mentoblo. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-neutral-600">
              <a href="#" className="hover:text-neutral-900"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="hover:text-neutral-900"><Github className="h-4 w-4" /></a>
              <a href="#" className="hover:text-neutral-900"><Globe className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MentobloLanding;