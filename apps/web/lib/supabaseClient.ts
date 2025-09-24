import { createClient } from '@supabase/supabase-js'

export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    throw new Error('Supabase env vars are not set')
  }
  return createClient(url, anon)
}

export type AnonymousCalculation = {
  id: string
  created_at: string
  age: number
  wasted_hours_per_day: number
  start_age: number
  wasted_years: number
}

