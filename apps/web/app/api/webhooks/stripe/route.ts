import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const stripeSecret = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' }) : null

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ ok: true, note: 'Stripe not configured' })
  }
  const sig = req.headers.get('stripe-signature') || ''
  const body = await req.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    return new NextResponse('Invalid signature', { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.user_id
      if (userId) {
        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            status: sub.status,
            price_id: sub.items.data[0]?.price?.id,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            stripe_customer_id: sub.customer?.toString(),
            stripe_subscription_id: sub.id
          }, { onConflict: 'user_id' })
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.user_id
      if (userId) {
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('user_id', userId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

