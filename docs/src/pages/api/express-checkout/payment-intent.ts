import type { APIRoute } from 'astro'
import Stripe from 'stripe'

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY)

export const GET: APIRoute = async () => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return Response.json({
    clientSecret: paymentIntent.client_secret,
  })
}
