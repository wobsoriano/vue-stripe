import { stripe } from '~/lib/stripe'

async function createTestPriceId() {
  const price = await stripe.prices.create({
    product: 'stripe_vue_abc123',
    unit_amount: 1000,
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
    lookup_key: 'standard_monthly',
  })

  return price.id
}

export default eventHandler(async (event) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: await createTestPriceId(),
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `localhost:3000/return?session_id={CHECKOUT_SESSION_ID}`,
  })

  return {
    clientSecret: session.client_secret,
  }
})
