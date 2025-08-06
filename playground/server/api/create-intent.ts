import { stripe } from '../../lib/stripe'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  const result = await stripe.paymentIntents.create(body)
  return result
})
