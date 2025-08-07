import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'
import Stripe from 'stripe'

export function useServerStripe(event: H3Event): Stripe {
  const config = useRuntimeConfig(event)

  if (event.context._stripe) {
    return event.context._stripe
  }

  const stripe = new Stripe(config.stripe.secretKey)
  event.context._stripe = stripe

  return stripe
}
