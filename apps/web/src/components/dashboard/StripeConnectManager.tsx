'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createStripeConnectAccount } from '@/lib/actions/stripe'
import type { Profile } from '@/types'

interface StripeConnectManagerProps {
  profile: Profile
}

export function StripeConnectManager({ profile }: StripeConnectManagerProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for success/error messages from URL parameters
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    
    if (success === 'stripe_connected') {
      setMessage('Stripe account connected successfully! You can now receive payments.')
    } else if (error === 'onboarding_update_failed') {
      setMessage('Stripe account was created but there was an issue updating your profile. Please try again.')
    } else if (error === 'onboarding_failed') {
      setMessage('There was an error completing the Stripe onboarding. Please try again.')
    }
  }, [searchParams])

  const handleConnectStripe = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { url } = await createStripeConnectAccount()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to connect with Stripe')
      setLoading(false)
    }
  }

  const handleOpenStripeDashboard = () => {
    // This would open the Stripe Express dashboard
    // For now, we'll just show a message
    setMessage('Stripe Express dashboard would open here')
  }

  if (profile.stripe_onboarding_complete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Stripe Account Connected
          </CardTitle>
          <CardDescription>
            You are ready to receive payments for your tutoring sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
              <span className="text-sm text-gray-600">
                Your Stripe account is fully set up and ready to receive payments.
              </span>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Payment Information</h4>
              <div className="text-sm text-green-700 space-y-1">
                <p>• You'll receive 95% of each session payment</p>
                <p>• Payments are processed securely through Stripe</p>
                <p>• Funds are transferred to your bank account automatically</p>
                <p>• You can track all transactions in your Stripe dashboard</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleOpenStripeDashboard} variant="outline">
                View Stripe Dashboard
              </Button>
              <Button variant="outline">
                Update Bank Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          Receive Payments with Stripe
        </CardTitle>
        <CardDescription>
          Connect your bank account to start receiving payments for your tutoring sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Why Stripe?</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Secure payment processing trusted by millions of businesses</p>
              <p>• Automatic transfers to your bank account</p>
              <p>• Professional invoicing and payment tracking</p>
              <p>• Industry-leading fraud protection</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">How it works</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>1. Connect your bank account through Stripe's secure onboarding</p>
              <p>2. Students pay for sessions through our platform</p>
              <p>3. You receive 95% of each payment (5% platform fee)</p>
              <p>4. Funds are automatically transferred to your account</p>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-md ${
              message.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-600' 
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              <p className="text-sm">{message}</p>
            </div>
          )}

          <Button 
            onClick={handleConnectStripe}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Connect with Stripe
              </div>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By connecting with Stripe, you agree to their Terms of Service and Privacy Policy.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
