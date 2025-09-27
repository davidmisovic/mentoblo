type ResultPageProps = { params: { id: string } }

async function getData(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mentoblo.com'
  const res = await fetch(`${baseUrl}/api/result/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function ResultPage({ params }: ResultPageProps) {
  const id = params.id
  const data = await getData(id)
  
  const wastedYears = data?.wasted_years || 0
  const wastedYearsFormatted = wastedYears.toFixed(1)
  const wastedDays = Math.round(wastedYears * 365)
  const wastedHours = Math.round(wastedYears * 365 * 24)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section with Massive Impact */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
          {/* Main Impact Number */}
          <div className="mb-16">
            <div className="relative inline-block">
              <div className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-700 mb-6 leading-none">
                {wastedYearsFormatted}
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-xl"></div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                YEARS WASTED
              </h1>
              <div className="text-2xl text-gray-300 font-medium">
                That's <span className="text-red-400 font-bold">{wastedDays.toLocaleString()}</span> days
              </div>
              <div className="text-xl text-gray-400">
                <span className="text-red-400 font-bold">{wastedHours.toLocaleString()}</span> hours of your life
              </div>
            </div>
          </div>

          {/* Calculation Summary Card */}
          <div className="max-w-2xl mx-auto mb-20">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="text-sm text-gray-400 mb-4 font-medium tracking-wide uppercase">Your Reality Check</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">{data?.age}</div>
                  <div className="text-sm text-gray-400">Current Age</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">{data?.start_age}</div>
                  <div className="text-sm text-gray-400">Started Wasting At</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">{data?.wasted_hours_per_day}h</div>
                  <div className="text-sm text-gray-400">Per Day</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              These numbers are <span className="text-red-400">real</span>.
            </h2>
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-300">
              But they don't have to be your <span className="text-green-400">future</span>.
            </h3>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-300 leading-relaxed mb-12">
              The mirror has shown you the truth. Now, <span className="text-white font-semibold">Mentoblo Pro</span> will give you the tools to change it. 
              Start your free 14-day trial and take back control of your most precious resource.
            </p>
          </div>
          
          {/* Premium CTA Button */}
          <div className="relative group">
            <a 
              href="/signup" 
              className="relative inline-flex items-center justify-center px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-red-500/25"
            >
              <span className="relative z-10">Start My 14-Day Free Trial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="pt-8 space-y-4">
            <div className="text-sm text-gray-500">
              ✓ No credit card required • ✓ Cancel anytime • ✓ 14-day free trial
            </div>
            <div className="text-xs text-gray-600">
              Join thousands who have reclaimed their time
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Debug Info */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-600 opacity-50">
        ID: {id.slice(0, 8)}...
      </div>
    </div>
  )
}

