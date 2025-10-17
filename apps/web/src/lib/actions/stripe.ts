'use server'

import { createClient } from '@/lib/supabase/server'
import { createConnectAccount, createAccountLink, getAccountDetails } from '@/lib/stripe'
import { redirect } from 'next/navigation'

export async function createStripeConnectAccount() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.user_role !== 'tutor') {
    throw new Error('Only tutors can create Stripe Connect accounts')
  }

  try {
    let accountId = profile.stripe_connect_id

    // Create Stripe Connect account if it doesn't exist
    if (!accountId) {
      const account = await createConnectAccount(user.email!)
      accountId = account.id
      
      // Update profile with Stripe Connect ID
      const { error } = await supabase
        .from('profiles')
        .update({ stripe_connect_id: accountId })
        .eq('id', user.id)

      if (error) {
        throw new Error('Failed to save Stripe Connect account')
      }
    }

    // Create onboarding link
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/connect/success`
    const refreshUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings/payments`
    
    const accountLink = await createAccountLink(
      accountId,
      refreshUrl,
      returnUrl
    )

    return { url: accountLink.url }
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    throw new Error('Failed to create Stripe Connect account')
  }
}

export async function createStripeOnboardingLink() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_connect_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_connect_id) {
    throw new Error('Stripe Connect account not found')
  }

  try {
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings/payments?onboarding=complete`
    const refreshUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings/payments?onboarding=refresh`
    
    const accountLink = await createAccountLink(
      profile.stripe_connect_id,
      refreshUrl,
      returnUrl
    )

    return { url: accountLink.url }
  } catch (error) {
    console.error('Error creating onboarding link:', error)
    throw new Error('Failed to create onboarding link')
  }
}

export async function checkStripeOnboardingStatus() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_connect_id, stripe_onboarding_complete')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_connect_id) {
    return { hasAccount: false, isComplete: false }
  }

  try {
    const account = await getAccountDetails(profile.stripe_connect_id)
    
    const isComplete = account.charges_enabled && account.payouts_enabled
    
    // Update onboarding status if it has changed
    if (isComplete !== profile.stripe_onboarding_complete) {
      await supabase
        .from('profiles')
        .update({ stripe_onboarding_complete: isComplete })
        .eq('id', user.id)
    }

    return {
      hasAccount: true,
      isComplete,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted
    }
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return { hasAccount: true, isComplete: false }
  }
}

export async function updateHourlyRate(rateCents: number) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  if (rateCents < 100) { // Minimum $1.00
    throw new Error('Hourly rate must be at least $1.00')
  }

  if (rateCents > 100000) { // Maximum $1000.00
    throw new Error('Hourly rate cannot exceed $1000.00')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ hourly_rate_cents: rateCents })
    .eq('id', user.id)

  if (error) {
    throw new Error('Failed to update hourly rate')
  }

  return { success: true }
}
