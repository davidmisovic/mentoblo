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
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Supporting Student Mental Health in Online Tutoring</h1>
          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-6">
            <span>By Mentoblo Team</span>
            <span>•</span>
            <time dateTime="2023-12-10">December 10, 2023</time>
            <span>•</span>
            <span>11 min read</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">Mental Health</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Wellness</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Support</span>
          </div>
        </div>

        <article className="prose prose-neutral max-w-none">
          <p className="text-xl text-neutral-700 mb-8">
            Learn how to support student mental health and well-being in online tutoring environments. Discover strategies for creating safe, supportive learning spaces that promote both academic success and emotional wellness.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">The Importance of Mental Health in Education</h2>
          <p className="text-neutral-700 mb-6">
            Student mental health significantly impacts learning outcomes, engagement, and overall well-being. Online tutors play a crucial role in creating supportive environments that promote both academic success and emotional wellness.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Mental Health Impact on Learning</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Cognitive function</strong> - Mental health affects concentration and memory</li>
            <li><strong>Motivation levels</strong> - Emotional well-being influences engagement</li>
            <li><strong>Social interaction</strong> - Mental health impacts communication and collaboration</li>
            <li><strong>Academic performance</strong> - Emotional wellness correlates with achievement</li>
            <li><strong>Resilience building</strong> - Mental health supports learning from challenges</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Recognizing Mental Health Signs</h2>
          <p className="text-neutral-700 mb-6">
            Being able to recognize signs of mental health struggles helps tutors provide appropriate support and referrals. Understanding common indicators enables proactive intervention and support.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Warning Signs to Watch For</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Behavioral changes</strong> - Sudden shifts in participation or engagement</li>
            <li><strong>Academic decline</strong> - Unexplained drops in performance</li>
            <li><strong>Social withdrawal</strong> - Reduced interaction with peers or tutors</li>
            <li><strong>Emotional expressions</strong> - Signs of anxiety, depression, or stress</li>
            <li><strong>Physical symptoms</strong> - Fatigue, changes in appearance, or health complaints</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Creating Safe Learning Environments</h2>
          <p className="text-neutral-700 mb-6">
            Safe, supportive learning environments promote mental health and academic success. Tutors can implement strategies that create psychological safety and encourage open communication.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Environment Strategies</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Establish trust</strong> - Build rapport and demonstrate care</li>
            <li><strong>Set clear expectations</strong> - Provide structure and predictability</li>
            <li><strong>Encourage mistakes</strong> - Frame errors as learning opportunities</li>
            <li><strong>Promote inclusion</strong> - Ensure all students feel valued</li>
            <li><strong>Model vulnerability</strong> - Share appropriate personal experiences</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Communication Strategies</h2>
          <p className="text-neutral-700 mb-6">
            Effective communication about mental health requires sensitivity, empathy, and appropriate boundaries. Tutors should know how to discuss mental health topics while maintaining professional relationships.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Communication Approaches</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Active listening</strong> - Give full attention and show understanding</li>
            <li><strong>Non-judgmental responses</strong> - Avoid criticism or blame</li>
            <li><strong>Open-ended questions</strong> - Encourage sharing without pressure</li>
            <li><strong>Validation</strong> - Acknowledge feelings and experiences</li>
            <li><strong>Professional boundaries</strong> - Know when to refer to specialists</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Stress Management Techniques</h2>
          <p className="text-neutral-700 mb-6">
            Teaching stress management techniques helps students build resilience and coping skills. These strategies support both academic performance and overall well-being.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Stress Reduction Methods</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Breathing exercises</strong> - Simple techniques for immediate relief</li>
            <li><strong>Mindfulness practices</strong> - Present-moment awareness and focus</li>
            <li><strong>Time management</strong> - Organization and prioritization skills</li>
            <li><strong>Physical activity</strong> - Movement and exercise recommendations</li>
            <li><strong>Relaxation techniques</strong> - Progressive muscle relaxation and visualization</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Building Resilience</h2>
          <p className="text-neutral-700 mb-6">
            Resilience helps students navigate challenges and setbacks effectively. Tutors can foster resilience through supportive teaching practices and skill development.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Resilience Building Strategies</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Growth mindset</strong> - Emphasizing effort and learning from failure</li>
            <li><strong>Problem-solving skills</strong> - Teaching systematic approaches to challenges</li>
            <li><strong>Emotional regulation</strong> - Managing feelings and responses</li>
            <li><strong>Social connections</strong> - Building supportive relationships</li>
            <li><strong>Self-care practices</strong> - Promoting healthy habits and boundaries</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Referral and Support Resources</h2>
          <p className="text-neutral-700 mb-6">
            Knowing when and how to refer students to mental health professionals is crucial. Tutors should understand their role and limitations in supporting student mental health.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Referral Guidelines</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Recognize limitations</strong> - Know when professional help is needed</li>
            <li><strong>Maintain confidentiality</strong> - Respect privacy and trust</li>
            <li><strong>Provide resources</strong> - Share information about support services</li>
            <li><strong>Follow up appropriately</strong> - Check in without overstepping boundaries</li>
            <li><strong>Document concerns</strong> - Keep appropriate records of observations</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Self-Care for Tutors</h2>
          <p className="text-neutral-700 mb-6">
            Supporting student mental health can be emotionally demanding. Tutors must prioritize their own mental health and well-being to provide effective support.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Tutor Self-Care Strategies</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Set boundaries</strong> - Maintain professional and personal limits</li>
            <li><strong>Seek support</strong> - Connect with colleagues and mentors</li>
            <li><strong>Practice self-compassion</strong> - Be kind to yourself</li>
            <li><strong>Engage in hobbies</strong> - Pursue activities outside of work</li>
            <li><strong>Professional development</strong> - Continue learning about mental health</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Technology and Mental Health</h2>
          <p className="text-neutral-700 mb-6">
            Technology can both support and challenge student mental health. Understanding the digital wellness implications helps tutors create balanced learning experiences.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Digital Wellness Considerations</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Screen time balance</strong> - Managing digital engagement</li>
            <li><strong>Online safety</strong> - Protecting student privacy and security</li>
            <li><strong>Digital detox</strong> - Encouraging breaks from technology</li>
            <li><strong>Accessibility</strong> - Ensuring inclusive digital experiences</li>
            <li><strong>Connection quality</strong> - Maintaining meaningful relationships online</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Conclusion</h2>
          <p className="text-neutral-700 mb-8">
            Supporting student mental health in online tutoring requires awareness, empathy, and appropriate action. By creating safe environments, using effective communication, and knowing when to refer to professionals, tutors can make a positive impact on student well-being and academic success.
          </p>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-pink-900 mb-3">Support Student Well-being with Mentoblo</h3>
            <p className="text-pink-800 mb-4">
              Mentoblo provides tools and features that help you create supportive, engaging learning environments for all students.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-md border border-pink-600 bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700">
              Start Supporting Students Today
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
