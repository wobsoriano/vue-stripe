import type { APIRoute } from 'astro'
import Stripe from 'stripe'

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY)

export const GET: APIRoute = async () => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
    payment_method_types: ['card'],
  })

  return Response.json({
    clientSecret: paymentIntent.client_secret,
  })
}
