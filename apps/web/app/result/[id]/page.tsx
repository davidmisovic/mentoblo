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
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
        These numbers are real. But they don't have to be your future.
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        The mirror has shown you the truth. Now, Mentoblo Pro will give you the tools to change it. Start your free 14-day trial and take back control.
      </p>
      <div className="mt-10">
        <a href="/signup" className="inline-flex items-center rounded-md bg-black px-5 py-3 text-white hover:bg-gray-800">
          Start My 14-Day Free Trial
        </a>
      </div>
      <div className="mt-8 text-sm text-gray-500">
        <p>Result ID: {id}</p>
        {data && (
          <p className="mt-2">
            Age {data.age}, started at {data.start_age}, avg {data.wasted_hours_per_day}h/day → wasted years: {data.wasted_years.toFixed?.(2) ?? data.wasted_years}
          </p>
        )}
      </div>
    </main>
  )
}

