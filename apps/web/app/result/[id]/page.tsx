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
  
  return (
    <main className="mx-auto max-w-4xl px-6 py-24 text-center">
      {/* Main Impact Section */}
      <div className="mb-16">
        <div className="mb-8">
          <div className="text-8xl font-bold text-red-600 mb-4">
            {wastedYearsFormatted}
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">
            YEARS WASTED
          </div>
          <div className="text-lg text-gray-600">
            That's {Math.round(wastedYears * 365)} days of your life
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="text-sm text-gray-600 mb-2">Your calculation:</div>
          <div className="text-lg">
            <span className="font-semibold">Age {data?.age}</span> • 
            Started at <span className="font-semibold">{data?.start_age}</span> • 
            <span className="font-semibold">{data?.wasted_hours_per_day}h/day</span>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
          These numbers are real.
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          But they don't have to be your future.
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          The mirror has shown you the truth. Now, Mentoblo Pro will give you the tools to change it. 
          Start your free 14-day trial and take back control.
        </p>
        
        <a 
          href="/signup" 
          className="inline-flex items-center rounded-lg bg-black px-8 py-4 text-xl font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          Start My 14-Day Free Trial
        </a>
      </div>

      {/* Debug info - remove in production */}
      <div className="mt-12 text-xs text-gray-400">
        <p>Result ID: {id}</p>
      </div>
    </main>
  )
}

