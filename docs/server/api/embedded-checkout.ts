import { useServerStripe } from '../utils/useServerStripe'

export default eventHandler(async (event) => {
  const stripe = useServerStripe(event)

  const requestUrl = getRequestURL(event)
  const returnUrl = new URL('/success', `${requestUrl.protocol}//${requestUrl.host}`)

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

  return {
    clientSecret: session.client_secret,
  }
})
