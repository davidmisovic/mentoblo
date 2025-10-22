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
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">English Tutoring: Developing Strong Writing Skills in Students</h1>
          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-6">
            <span>By Mentoblo Team</span>
            <span>•</span>
            <time dateTime="2024-01-16">January 16, 2024</time>
            <span>•</span>
            <span>11 min read</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">English Tutoring</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Writing Skills</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Language Arts</span>
          </div>
        </div>

        <article className="prose prose-neutral max-w-none">
          <p className="text-xl text-neutral-700 mb-8">
            Master the art of teaching writing skills through effective English tutoring. Learn proven strategies to help students develop strong writing abilities, from basic grammar to advanced composition techniques.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">The Foundation of Good Writing</h2>
          <p className="text-neutral-700 mb-6">
            Strong writing skills begin with a solid foundation in grammar, vocabulary, and sentence structure. Help students understand that writing is a process, not just a final product.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Essential Writing Components</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Grammar and mechanics</strong> - Proper sentence structure and punctuation</li>
            <li><strong>Vocabulary development</strong> - Expanding word choice and usage</li>
            <li><strong>Organization</strong> - Clear structure and logical flow</li>
            <li><strong>Voice and style</strong> - Developing personal writing voice</li>
            <li><strong>Revision skills</strong> - Learning to edit and improve writing</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">The Writing Process</h2>
          <p className="text-neutral-700 mb-6">
            Teach students that writing is a recursive process involving multiple stages. Each stage requires different skills and approaches.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Five Stages of Writing</h3>
          <ol className="list-decimal list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Prewriting</strong> - Brainstorming, outlining, and planning</li>
            <li><strong>Drafting</strong> - Getting ideas down on paper</li>
            <li><strong>Revising</strong> - Improving content and organization</li>
            <li><strong>Editing</strong> - Correcting grammar and mechanics</li>
            <li><strong>Publishing</strong> - Sharing the final product</li>
          </ol>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Building Vocabulary Skills</h2>
          <p className="text-neutral-700 mb-6">
            A rich vocabulary is essential for effective writing. Help students expand their word knowledge through various strategies and activities.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Vocabulary Development Strategies</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Context clues</strong> - Using surrounding words to determine meaning</li>
            <li><strong>Word roots and affixes</strong> - Understanding word parts and origins</li>
            <li><strong>Synonyms and antonyms</strong> - Exploring word relationships</li>
            <li><strong>Word journals</strong> - Keeping track of new vocabulary</li>
            <li><strong>Word games</strong> - Making vocabulary learning fun</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Teaching Different Writing Genres</h2>
          <p className="text-neutral-700 mb-6">
            Students need exposure to various writing genres to develop versatility and understanding of different purposes and audiences.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Essential Writing Genres</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Narrative writing</strong> - Stories, personal experiences, and creative pieces</li>
            <li><strong>Expository writing</strong> - Informational and explanatory texts</li>
            <li><strong>Persuasive writing</strong> - Arguments and opinion pieces</li>
            <li><strong>Descriptive writing</strong> - Vivid details and sensory language</li>
            <li><strong>Compare and contrast</strong> - Analyzing similarities and differences</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Developing Critical Thinking Through Writing</h2>
          <p className="text-neutral-700 mb-6">
            Writing is an excellent tool for developing critical thinking skills. Encourage students to analyze, evaluate, and synthesize information.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Critical Thinking Activities</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Argument analysis</strong> - Evaluating different perspectives</li>
            <li><strong>Evidence evaluation</strong> - Assessing the quality of sources</li>
            <li><strong>Logical reasoning</strong> - Developing sound arguments</li>
            <li><strong>Problem-solving</strong> - Using writing to work through complex issues</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Technology Integration in Writing Instruction</h2>
          <p className="text-neutral-700 mb-6">
            Modern writing instruction should incorporate technology tools that enhance the writing process and prepare students for digital communication.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Digital Writing Tools</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Word processing software</strong> - Microsoft Word, Google Docs</li>
            <li><strong>Grammar checkers</strong> - Grammarly, Hemingway Editor</li>
            <li><strong>Collaboration platforms</strong> - Shared documents and peer review</li>
            <li><strong>Multimedia tools</strong> - Incorporating images, videos, and audio</li>
            <li><strong>Publishing platforms</strong> - Blogs, websites, and digital portfolios</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Assessment and Feedback Strategies</h2>
          <p className="text-neutral-700 mb-6">
            Effective assessment helps students understand their strengths and areas for improvement. Use a variety of assessment methods to evaluate writing progress.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Assessment Approaches</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Rubric-based assessment</strong> - Clear criteria for evaluation</li>
            <li><strong>Peer review</strong> - Students evaluating each other's work</li>
            <li><strong>Self-assessment</strong> - Students reflecting on their own writing</li>
            <li><strong>Portfolio assessment</strong> - Collections of work over time</li>
            <li><strong>Conferencing</strong> - One-on-one discussions about writing</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Motivating Reluctant Writers</h2>
          <p className="text-neutral-700 mb-6">
            Many students struggle with writing motivation. Use creative strategies to engage reluctant writers and help them discover their voice.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Engagement Strategies</h3>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li><strong>Choice and voice</strong> - Allowing students to choose topics and formats</li>
            <li><strong>Real-world connections</strong> - Writing for authentic audiences</li>
            <li><strong>Creative prompts</strong> - Engaging and imaginative writing starters</li>
            <li><strong>Collaborative writing</strong> - Working together on projects</li>
            <li><strong>Celebration of progress</strong> - Recognizing improvement and effort</li>
          </ul>

          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Conclusion</h2>
          <p className="text-neutral-700 mb-8">
            Effective English tutoring focuses on developing the whole writer, not just correcting grammar. By teaching the writing process, building vocabulary, and providing meaningful feedback, you can help students become confident, skilled writers who can communicate effectively in any situation.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-3">Ready to Help Students Excel in Writing?</h3>
            <p className="text-red-800 mb-4">
              Mentoblo's AI-powered lesson planning can help you create engaging writing activities and track student progress effectively.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-md border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
              Start Your English Tutoring Journey
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
