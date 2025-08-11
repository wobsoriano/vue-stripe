import { useServerStripe } from '../../utils/useServerStripe'

export default eventHandler(async (event) => {
  const stripe = useServerStripe(event)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
    payment_method_types: ['card'],
  })

  return {
    clientSecret: paymentIntent.client_secret,
  }
})
