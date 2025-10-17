import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

// Stripe Connect account creation
export async function createConnectAccount(email: string, country: string = 'US') {
  const account = await stripe.accounts.create({
    type: 'express',
    country,
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })

  return account
}

// Create account link for onboarding
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  })

  return accountLink
}

// Create payment intent for a booking
export async function createPaymentIntent(
  amount: number,
  tutorId: string,
  studentId: string | null,
  bookingId: number,
  applicationFeeAmount: number
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    application_fee_amount: applicationFeeAmount,
    transfer_data: {
      destination: tutorId,
    },
    metadata: {
      booking_id: bookingId.toString(),
      student_id: studentId || 'guest',
    },
  })

  return paymentIntent
}

// Get account details
export async function getAccountDetails(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId)
  return account
}

// Calculate platform fee (5% of total amount)
export function calculatePlatformFee(amountCents: number): number {
  return Math.round(amountCents * 0.05) // 5% platform fee
}

// Calculate tutor earnings
export function calculateTutorEarnings(amountCents: number, platformFeeCents: number): number {
  return amountCents - platformFeeCents
}

// Format currency for display
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}
