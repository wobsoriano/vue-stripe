import type { APIRoute } from 'astro'
import Stripe from 'stripe'

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY)

export const GET: APIRoute = async ({ request }) => {
  const returnUrl = new URL('/success', `http://localhost:4321`)

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price: 'price_1Rug5eF1gmAl8mdreU18dl12',
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: returnUrl.toString(),
  })

  return Response.json({
    clientSecret: session.client_secret,
  })
}
