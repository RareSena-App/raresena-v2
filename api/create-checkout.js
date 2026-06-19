// api/create-checkout.js — Creates Stripe Checkout sessions (Vercel Serverless Function)
// Handles both Rebuild Premium and Rare Studio creator membership payments

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { priceId, customerEmail, successUrl, cancelUrl, productType, membershipType } = req.body

  if (!priceId || !customerEmail) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: membershipType === 'one_off' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${process.env.VITE_APP_URL}?payment=success`,
      cancel_url: cancelUrl || `${process.env.VITE_APP_URL}?payment=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        app: 'raresena',
        product_type: productType || 'rebuild_premium',
        membership_type: membershipType || 'subscription',
      },
    })

    return res.status(200).json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return res.status(500).json({ error: err.message })
  }
}
