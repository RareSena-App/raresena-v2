// api/webhook.js — Stripe webhook handler (Vercel Serverless Function)
// Handles payment events for both Rebuild Premium and Rare Studio creator membership

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const sig = req.headers['stripe-signature']
  const rawBody = await getRawBody(req)
  let event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature failed:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object
      const customerEmail = session.customer_email || session.customer_details?.email
      const metadata = session.metadata || {}
      const productType = metadata.product_type || 'rebuild_premium'

      if (!customerEmail) break

      if (productType === 'creator_membership') {
        // Creator membership payment — activate creator portal access
        await supabase
          .from('rebuilders')
          .update({
            is_creator: true,
            creator_status: 'active',
            creator_membership_type: metadata.membership_type || 'one_off',
            creator_activated_at: new Date().toISOString(),
            stripe_customer_id: session.customer,
            updated_at: new Date().toISOString(),
          })
          .eq('email', customerEmail)

      } else {
        // Rebuild Premium payment — activate premium features
        await supabase
          .from('rebuilders')
          .update({
            is_premium: true,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            premium_activated_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('email', customerEmail)
      }
      break
    }

    case 'customer.subscription.deleted': {
      // Subscription cancelled — remove premium or creator access
      const subscription = event.data.object
      const metadata = subscription.metadata || {}
      const productType = metadata.product_type || 'rebuild_premium'

      if (productType === 'creator_membership') {
        await supabase
          .from('rebuilders')
          .update({
            is_creator: false,
            creator_status: 'inactive',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', subscription.customer)
      } else {
        await supabase
          .from('rebuilders')
          .update({
            is_premium: false,
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', subscription.customer)
      }
      break
    }

    case 'invoice.payment_succeeded': {
      // Recurring payment succeeded — log for commission tracking
      const invoice = event.data.object
      console.log('Recurring payment succeeded:', invoice.customer, invoice.amount_paid)
      break
    }

    case 'invoice.payment_failed': {
      // Payment failed — log for retry handling
      const invoice = event.data.object
      console.log('Payment failed for customer:', invoice.customer)
      // In production: send payment failed notification email via ConvertKit or Resend
      break
    }
  }

  return res.status(200).json({ received: true })
}

