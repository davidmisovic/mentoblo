import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthButton } from '@/components/auth/auth-button'
import { StripeConnectManager } from '@/components/dashboard/StripeConnectManager'
import { PaymentSettings } from '@/components/dashboard/PaymentSettings'

export default async function PaymentSettingsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Redirect if not a tutor
  if (profile?.user_role !== 'tutor') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Mentoblo</span>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Settings
            </h1>
            <p className="text-lg text-gray-600">
              Set up your payment information and hourly rates to start earning from your tutoring sessions.
            </p>
          </div>

          <div className="space-y-8">
            {/* Stripe Connect Section */}
            <StripeConnectManager profile={profile} />
            
            {/* Additional Payment Settings */}
            <PaymentSettings profile={profile} />
          </div>
        </div>
      </main>
    </div>
  )
}
