'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createStripeConnectAccount, createStripeOnboardingLink, updateHourlyRate } from '@/lib/actions/stripe'
import { formatCurrency } from '@/lib/stripe'
import type { Profile } from '@/types'

interface PaymentSettingsProps {
  profile: Profile
}

export function PaymentSettings({ profile }: PaymentSettingsProps) {
  const [hourlyRate, setHourlyRate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [stripeStatus, setStripeStatus] = useState({
    hasAccount: false,
    isComplete: false,
    chargesEnabled: false,
    payoutsEnabled: false,
    detailsSubmitted: false
  })
  const supabase = createClient()

  const checkStripeStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-stripe-status')
      if (error) throw error
      setStripeStatus(data)
    } catch (error) {
      console.error('Error checking Stripe status:', error)
    }
  }, [supabase])

  useEffect(() => {
    // Initialize hourly rate from profile
    if (profile.hourly_rate_cents) {
      setHourlyRate((profile.hourly_rate_cents / 100).toString())
    }

    // Check Stripe Connect status
    checkStripeStatus()
  }, [profile, checkStripeStatus])

  const handleCreateStripeAccount = async () => {
    setLoading(true)
    setMessage('')

    try {
      await createStripeConnectAccount()
      setMessage('Stripe Connect account created successfully!')
      await checkStripeStatus()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to create Stripe account')
    }

    setLoading(false)
  }

  const handleStartOnboarding = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { url } = await createStripeOnboardingLink()
      window.location.href = url
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to start onboarding')
      setLoading(false)
    }
  }

  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const rateCents = Math.round(parseFloat(hourlyRate) * 100)

    try {
      await updateHourlyRate(rateCents)
      setMessage('Hourly rate updated successfully!')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update hourly rate')
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Stripe Connect Status */}
      <Card>
        <CardHeader>
          <CardTitle>Stripe Connect Account</CardTitle>
          <CardDescription>
            Connect your bank account to receive payments from students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!stripeStatus.hasAccount ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You need to create a Stripe Connect account to receive payments.
              </p>
              <Button onClick={handleCreateStripeAccount} disabled={loading}>
                {loading ? 'Creating...' : 'Create Stripe Account'}
              </Button>
            </div>
          ) : !stripeStatus.isComplete ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Setup Required</Badge>
                <span className="text-sm text-muted-foreground">
                  Complete your Stripe onboarding to start receiving payments
                </span>
              </div>
              <Button onClick={handleStartOnboarding} disabled={loading}>
                {loading ? 'Redirecting...' : 'Complete Onboarding'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Your Stripe account is ready to receive payments
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Charges:</span>
                  <span className={`ml-2 ${stripeStatus.chargesEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {stripeStatus.chargesEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Payouts:</span>
                  <span className={`ml-2 ${stripeStatus.payoutsEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {stripeStatus.payoutsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hourly Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Rate</CardTitle>
          <CardDescription>
            Set your hourly rate for tutoring sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateRate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Rate per hour (USD)</Label>
              <div className="flex items-center gap-2">
                <span className="text-lg">$</span>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  min="1.00"
                  max="1000.00"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="50.00"
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">per hour</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Students will see this rate when booking sessions with you
              </p>
            </div>
            <Button type="submit" disabled={loading || !hourlyRate}>
              {loading ? 'Updating...' : 'Update Rate'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payment Information */}
      {stripeStatus.isComplete && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>
              How payments work for your tutoring sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Platform Fee</h4>
                  <p className="text-sm text-blue-700">
                    We charge a 5% platform fee on each session to cover payment processing and platform maintenance.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Your Earnings</h4>
                  <p className="text-sm text-green-700">
                    You receive 95% of the session fee, paid directly to your bank account.
                  </p>
                </div>
              </div>
              
              {profile.hourly_rate_cents && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Example Payment</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Session Fee ({formatCurrency(profile.hourly_rate_cents)}):</span>
                      <span>{formatCurrency(profile.hourly_rate_cents)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Platform Fee (5%):</span>
                      <span>-{formatCurrency(Math.round(profile.hourly_rate_cents * 0.05))}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-600 border-t pt-1">
                      <span>Your Earnings:</span>
                      <span>{formatCurrency(Math.round(profile.hourly_rate_cents * 0.95))}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-600' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}
