import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ ok: true, url: null, note: 'Stripe not configured' })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
  const { priceId, userId, successUrl, cancelUrl } = await req.json()
  if (!priceId || !userId) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl || `${req.nextUrl.origin}/dashboard`,
    cancel_url: cancelUrl || `${req.nextUrl.origin}/settings`,
    metadata: { user_id: userId },
    subscription_data: { metadata: { user_id: userId } }
  })
  return NextResponse.json({ id: session.id, url: session.url })
}

