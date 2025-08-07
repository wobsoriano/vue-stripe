import { useServerStripe } from '../utils/useServerStripe'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  const stripe = useServerStripe(event)
  const result = await stripe.paymentIntents.create(body)
  return result
})
