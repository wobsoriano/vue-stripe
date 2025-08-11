import { useServerStripe } from '../../utils/useServerStripe'

export default eventHandler(async (event) => {
  const stripe = useServerStripe(event)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return {
    clientSecret: paymentIntent.client_secret,
  }
})
