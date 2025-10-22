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
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Math Tutoring Strategies for Elementary Students: Building Strong Foundations</h1>
          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-6">
            <span>By Mentoblo Team</span>
            <span>•</span>
            <time dateTime="2024-01-18">January 18, 2024</time>
            <span>•</span>
            <span>10 min read</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Math Tutoring</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Elementary Education</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Teaching Methods</span>
          </div>
        </div>

        <article className="prose prose-neutral max-w-none">
          <p className="text-xl text-neutral-700 mb-8">
            Discover effective math tutoring strategies specifically designed for elementary students. Learn how to make math fun, build confidence, and create lasting mathematical understanding in young learners.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Understanding Elementary Math Development</h2>
          <p className="text-neutral-700 mb-6">
            Elementary students are at a critical stage of mathematical development. Their brains are rapidly developing, and they're forming fundamental concepts that will influence their entire mathematical journey. Understanding these developmental stages is crucial for effective tutoring.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Key Developmental Milestones</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Ages 5-7:</strong> Concrete operational thinking, counting, basic addition/subtraction</li>
            <li><strong>Ages 7-9:</strong> Understanding place value, multiplication concepts, problem-solving</li>
            <li><strong>Ages 9-11:</strong> Abstract thinking, fractions, decimals, algebraic thinking</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Making Math Fun and Engaging</h2>
          <p className="text-neutral-700 mb-6">
            Young students learn best when they're having fun. Incorporate games, manipulatives, and real-world connections to make math concepts come alive.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Interactive Learning Tools</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Manipulatives:</strong> Blocks, counters, fraction circles, and geometric shapes</li>
            <li><strong>Math games:</strong> Board games, card games, and digital math apps</li>
            <li><strong>Visual aids:</strong> Charts, graphs, diagrams, and colorful illustrations</li>
            <li><strong>Story problems:</strong> Real-world scenarios that students can relate to</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Building Number Sense</h2>
          <p className="text-neutral-700 mb-6">
            Number sense is the foundation of all mathematical understanding. Help students develop a deep, intuitive understanding of numbers and their relationships.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Essential Number Sense Skills</h3>
          <ol className="list-decimal list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Counting and cardinality</strong> - Understanding that numbers represent quantities</li>
            <li><strong>Number recognition</strong> - Identifying numbers in various contexts</li>
            <li><strong>Comparing and ordering</strong> - Understanding relationships between numbers</li>
            <li><strong>Composing and decomposing</strong> - Breaking numbers apart and putting them together</li>
          </ol>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Addressing Math Anxiety</h2>
          <p className="text-neutral-700 mb-6">
            Many elementary students develop math anxiety early. Create a supportive, encouraging environment that celebrates effort and progress over perfection.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Building Confidence Strategies</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Start with success</strong> - Begin sessions with problems students can solve</li>
            <li><strong>Celebrate mistakes</strong> - Frame errors as learning opportunities</li>
            <li><strong>Use positive language</strong> - Focus on growth and improvement</li>
            <li><strong>Set achievable goals</strong> - Break complex problems into manageable steps</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Differentiated Instruction</h2>
          <p className="text-neutral-700 mb-6">
            Every student learns differently. Adapt your teaching methods to meet individual needs and learning styles.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Learning Style Adaptations</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Visual learners:</strong> Use diagrams, charts, and visual representations</li>
            <li><strong>Auditory learners:</strong> Incorporate songs, rhymes, and verbal explanations</li>
            <li><strong>Kinesthetic learners:</strong> Hands-on activities and movement-based learning</li>
            <li><strong>Mixed learners:</strong> Combine multiple approaches for comprehensive understanding</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Parent Communication</h2>
          <p className="text-neutral-700 mb-6">
            Regular communication with parents is essential for student success. Keep families informed about progress, challenges, and ways they can support learning at home.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Effective Communication Strategies</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Regular progress reports</strong> - Weekly or bi-weekly updates</li>
            <li><strong>Homework guidance</strong> - Clear instructions for home practice</li>
            <li><strong>Celebration sharing</strong> - Highlight student achievements and milestones</li>
            <li><strong>Resource recommendations</strong> - Suggest helpful materials and activities</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Assessment and Progress Tracking</h2>
          <p className="text-neutral-700 mb-6">
            Regular assessment helps identify strengths and areas for improvement. Use a variety of assessment methods to get a complete picture of student understanding.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Assessment Types</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Formative assessments</strong> - Ongoing checks for understanding</li>
            <li><strong>Performance tasks</strong> - Real-world problem-solving activities</li>
            <li><strong>Self-assessments</strong> - Student reflection on their learning</li>
            <li><strong>Portfolio reviews</strong> - Collections of student work over time</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Conclusion</h2>
          <p className="text-neutral-700 mb-8">
            Effective elementary math tutoring requires patience, creativity, and a deep understanding of child development. By making math fun, building confidence, and adapting to individual needs, you can help young students develop a lifelong love of mathematics and strong foundational skills.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Ready to Help Elementary Students Succeed in Math?</h3>
            <p className="text-green-800 mb-4">
              Mentoblo's AI-powered lesson planning can help you create engaging, age-appropriate math activities for elementary students.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-md border border-green-600 bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
              Start Tutoring Today
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
