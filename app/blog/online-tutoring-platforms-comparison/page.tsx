import Link from 'next/link'

export default function BlogPost() {
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
              <Link 
                href="/signin"
                className="text-[14px] text-neutral-700 hover:text-neutral-900"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">← Back to Blog</Link>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Online Tutoring Platforms: A Comprehensive Comparison Guide</h1>
          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-6">
            <span>By Mentoblo Team</span>
            <span>•</span>
            <time dateTime="2024-01-10">January 10, 2024</time>
            <span>•</span>
            <span>15 min read</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Platform Comparison</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Technology</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Features</span>
          </div>
        </div>

        <article className="prose prose-neutral max-w-none">
          <p className="text-xl text-neutral-700 mb-8">
            Navigate the crowded landscape of online tutoring platforms with our comprehensive comparison guide. Discover the features, pricing, and capabilities of leading platforms to make an informed decision for your tutoring business.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">The Evolution of Online Tutoring Platforms</h2>
          <p className="text-neutral-700 mb-6">
            Online tutoring has transformed from simple video calls to sophisticated platforms offering comprehensive learning management systems. Understanding the current landscape is crucial for choosing the right platform for your needs.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Key Platform Categories</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>All-in-one platforms</strong> - Complete tutoring management solutions</li>
            <li><strong>Video conferencing tools</strong> - Basic communication platforms</li>
            <li><strong>Learning management systems</strong> - Content delivery and tracking</li>
            <li><strong>Marketplace platforms</strong> - Connecting tutors with students</li>
            <li><strong>Specialized tools</strong> - Subject-specific or feature-focused solutions</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Platform Comparison Matrix</h2>
          <p className="text-neutral-700 mb-6">
            Compare the leading online tutoring platforms across key features and capabilities. This comprehensive analysis will help you identify the best fit for your tutoring business.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Mentoblo: The Complete Solution</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">Key Features</h4>
            <ul className="list-disc list-inside text-blue-800 mb-4 space-y-1">
              <li>AI-powered lesson planning and content generation</li>
              <li>Comprehensive student management system</li>
              <li>Advanced scheduling and calendar integration</li>
              <li>Automated invoicing and payment processing</li>
              <li>Parent communication and progress tracking</li>
              <li>Multi-subject support with specialized tools</li>
            </ul>
            <p className="text-blue-800 font-medium">Best for: Independent tutors seeking a complete business management solution</p>
          </div>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Zoom: The Communication Standard</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-green-900 mb-3">Key Features</h4>
            <ul className="list-disc list-inside text-green-800 mb-4 space-y-1">
              <li>High-quality video and audio communication</li>
              <li>Screen sharing and whiteboard capabilities</li>
              <li>Recording and cloud storage options</li>
              <li>Breakout rooms for group sessions</li>
              <li>Integration with calendar systems</li>
              <li>Mobile and desktop applications</li>
            </ul>
            <p className="text-green-800 font-medium">Best for: Tutors who need reliable video communication with basic collaboration tools</p>
          </div>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Google Meet: The Integrated Solution</h3>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-purple-900 mb-3">Key Features</h4>
            <ul className="list-disc list-inside text-purple-800 mb-4 space-y-1">
              <li>Seamless integration with Google Workspace</li>
              <li>Real-time collaboration on documents</li>
              <li>Automatic transcription and captions</li>
              <li>Screen sharing and presentation tools</li>
              <li>Mobile optimization and accessibility</li>
              <li>Cost-effective for Google users</li>
            </ul>
            <p className="text-purple-800 font-medium">Best for: Tutors already using Google Workspace who need integrated communication</p>
          </div>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Microsoft Teams: The Enterprise Choice</h3>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-orange-900 mb-3">Key Features</h4>
            <ul className="list-disc list-inside text-orange-800 mb-4 space-y-1">
              <li>Comprehensive collaboration suite</li>
              <li>Advanced security and compliance features</li>
              <li>Integration with Microsoft 365 applications</li>
              <li>Meeting recording and transcription</li>
              <li>File sharing and co-authoring</li>
              <li>Advanced administrative controls</li>
            </ul>
            <p className="text-orange-800 font-medium">Best for: Educational institutions and large tutoring organizations</p>
          </div>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Feature Comparison Table</h2>
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border border-neutral-200 rounded-lg">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-900 border-b border-neutral-200">Feature</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-neutral-900 border-b border-neutral-200">Mentoblo</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-neutral-900 border-b border-neutral-200">Zoom</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-neutral-900 border-b border-neutral-200">Google Meet</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-neutral-900 border-b border-neutral-200">Microsoft Teams</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900">Video Quality</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">HD</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">HD</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">HD</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">HD</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900">Screen Sharing</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900">Whiteboard</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900">Recording</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900">Student Management</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✗</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✗</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✗</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900">Scheduling</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✗</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✗</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✗</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900">Invoicing</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✗</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✗</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✗</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900">AI Tools</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✓</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✗</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✗</td>
                  <td className="px-4 py-3 text-center text-sm text-neutral-600">✗</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Pricing Comparison</h2>
          <p className="text-neutral-700 mb-6">
            Understanding the cost structure of different platforms is crucial for budget planning. Consider both upfront costs and long-term value when making your decision.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Platform Pricing Overview</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Mentoblo:</strong> All-in-one pricing with no per-session fees</li>
            <li><strong>Zoom:</strong> Monthly subscription with participant limits</li>
            <li><strong>Google Meet:</strong> Free for basic use, paid for advanced features</li>
            <li><strong>Microsoft Teams:</strong> Included with Microsoft 365 subscriptions</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Choosing the Right Platform</h2>
          <p className="text-neutral-700 mb-6">
            The best platform for your tutoring business depends on your specific needs, budget, and growth plans. Consider these factors when making your decision.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Decision Factors</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Business size</strong> - Solo tutor vs. growing business</li>
            <li><strong>Feature requirements</strong> - Basic communication vs. comprehensive management</li>
            <li><strong>Budget constraints</strong> - Free vs. paid solutions</li>
            <li><strong>Technical expertise</strong> - User-friendly vs. advanced features</li>
            <li><strong>Integration needs</strong> - Standalone vs. integrated solutions</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Future Trends in Online Tutoring</h2>
          <p className="text-neutral-700 mb-6">
            The online tutoring landscape is rapidly evolving. Stay ahead of trends to ensure your platform choice remains relevant and effective.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Emerging Technologies</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Artificial Intelligence</strong> - Personalized learning and automated assessment</li>
            <li><strong>Virtual Reality</strong> - Immersive learning experiences</li>
            <li><strong>Augmented Reality</strong> - Interactive visual learning tools</li>
            <li><strong>Blockchain</strong> - Secure credentialing and certification</li>
            <li><strong>IoT Integration</strong> - Smart devices and connected learning</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Conclusion</h2>
          <p className="text-neutral-700 mb-8">
            Choosing the right online tutoring platform is a critical decision that can significantly impact your tutoring business success. Consider your specific needs, budget, and growth plans when evaluating options. Remember that the best platform is one that grows with your business and provides the tools you need to deliver exceptional tutoring experiences.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Ready to Choose Your Tutoring Platform?</h3>
            <p className="text-blue-800 mb-4">
              Mentoblo offers the most comprehensive solution for independent tutors, combining communication tools with business management features.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Try Mentoblo Free
            </Link>
          </div>
        </article>
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
