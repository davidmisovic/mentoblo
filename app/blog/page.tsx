'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  published_at: string
  slug: string
  tags: string[]
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
        return
      }
      fetchPosts()
    }
    checkUser()
  }, [router])

  const fetchPosts = async () => {
    try {
      // Mock blog posts for SEO content
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'The Future of Online Tutoring: How Technology is Transforming Education',
          excerpt: 'Explore how modern tutoring platforms are revolutionizing the way students learn and tutors teach.',
          content: 'Online tutoring has evolved significantly over the past decade...',
          author: 'Mentoblo Team',
          published_at: '2024-01-15',
          slug: 'future-online-tutoring-technology-education',
          tags: ['Education', 'Technology', 'Online Learning']
        },
        {
          id: '2',
          title: 'Best Practices for Student Engagement in Virtual Classrooms',
          excerpt: 'Learn effective strategies to keep students engaged and motivated during online tutoring sessions.',
          content: 'Student engagement is crucial for successful online learning...',
          author: 'Mentoblo Team',
          published_at: '2024-01-10',
          slug: 'student-engagement-virtual-classrooms-best-practices',
          tags: ['Teaching', 'Student Engagement', 'Virtual Learning']
        },
        {
          id: '3',
          title: 'Building a Successful Tutoring Business: A Complete Guide',
          excerpt: 'Everything you need to know about starting and growing a profitable tutoring business.',
          content: 'Starting a tutoring business can be both rewarding and challenging...',
          author: 'Mentoblo Team',
          published_at: '2024-01-05',
          slug: 'building-successful-tutoring-business-guide',
          tags: ['Business', 'Tutoring', 'Entrepreneurship']
        },
        {
          id: '4',
          title: 'The Psychology of Learning: Understanding How Students Learn Best',
          excerpt: 'Dive into the cognitive science behind effective learning and how tutors can apply these principles.',
          content: 'Understanding how the brain processes and retains information...',
          author: 'Mentoblo Team',
          published_at: '2024-01-01',
          slug: 'psychology-learning-understanding-students-learn',
          tags: ['Psychology', 'Learning', 'Cognitive Science']
        }
      ]
      
      setPosts(mockPosts)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
          <p className="mt-2 text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[8px] border border-neutral-200 bg-white shadow-sm grid place-items-center">
                <span className="text-[13px] font-medium tracking-tight text-neutral-900">M</span>
              </div>
              <span className="text-[15px] font-medium tracking-tight text-neutral-900">Mentoblo</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/dashboard" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Dashboard</Link>
              <Link href="/scheduling" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Scheduling</Link>
              <Link href="/students" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Students</Link>
              <Link href="/invoicing" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Invoicing</Link>
              <Link href="/ai" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">AI Tools</Link>
              <Link href="/blog" className="text-[14px] text-neutral-900 font-medium">Blog</Link>
            </nav>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/')
                }}
                className="text-[14px] text-neutral-700 hover:text-neutral-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Blog</h1>
          <p className="text-lg text-neutral-600">Insights, tips, and best practices for tutors and educators.</p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2 hover:text-neutral-700">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-neutral-600 mb-4">{post.excerpt}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <span>By {post.author}</span>
                  <span>•</span>
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-neutral-900 hover:text-neutral-700 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* SEO Content */}
        <div className="mt-16 bg-white rounded-lg border border-neutral-200 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">About Our Tutoring Platform</h2>
          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-600 mb-4">
              Mentoblo is a comprehensive tutoring management platform designed to help educators 
              streamline their teaching business. Our platform offers powerful tools for scheduling, 
              student management, invoicing, and AI-powered lesson planning.
            </p>
            <p className="text-neutral-600 mb-4">
              Whether you're a private tutor, tutoring center, or educational institution, 
              Mentoblo provides the tools you need to manage your students effectively, 
              create engaging lesson plans, and grow your tutoring business.
            </p>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Key Features:</h3>
            <ul className="list-disc list-inside text-neutral-600 space-y-2">
              <li>Student Management System</li>
              <li>AI-Powered Lesson Planning</li>
              <li>Automated Invoicing</li>
              <li>Schedule Management</li>
              <li>Parent Communication Tools</li>
              <li>Progress Tracking</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 rounded-[8px] border border-neutral-200 bg-white shadow-sm grid place-items-center">
                  <span className="text-[13px] font-medium tracking-tight text-neutral-900">M</span>
                </div>
                <span className="text-[15px] font-medium tracking-tight text-neutral-900">Mentoblo</span>
              </Link>
              <p className="text-sm text-neutral-600">
                The complete tutoring management platform for modern educators.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-sm text-neutral-600 hover:text-neutral-900">Dashboard</Link></li>
                <li><Link href="/students" className="text-sm text-neutral-600 hover:text-neutral-900">Students</Link></li>
                <li><Link href="/scheduling" className="text-sm text-neutral-600 hover:text-neutral-900">Scheduling</Link></li>
                <li><Link href="/invoicing" className="text-sm text-neutral-600 hover:text-neutral-900">Invoicing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-sm text-neutral-600 hover:text-neutral-900">Blog</Link></li>
                <li><Link href="/ai" className="text-sm text-neutral-600 hover:text-neutral-900">AI Tools</Link></li>
                <li><Link href="/help" className="text-sm text-neutral-600 hover:text-neutral-900">Help Center</Link></li>
                <li><Link href="/contact" className="text-sm text-neutral-600 hover:text-neutral-900">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-neutral-600 hover:text-neutral-900">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-neutral-600 hover:text-neutral-900">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-sm text-neutral-600 hover:text-neutral-900">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-neutral-600">
                © 2024 Mentoblo. All rights reserved.
              </p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <Link href="/blog" className="text-sm text-neutral-600 hover:text-neutral-900">Blog</Link>
                <Link href="/sitemap" className="text-sm text-neutral-600 hover:text-neutral-900">Sitemap</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
