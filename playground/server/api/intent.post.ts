export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)

  const intent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
  })

  return { clientSecret: intent.client_secret }
})
