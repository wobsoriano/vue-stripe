import type { Stripe } from '@stripe/stripe-js'
import type { ShallowRef } from 'vue'
import { useNuxtApp, useRuntimeConfig } from '#imports'
import { loadStripe } from '@stripe/stripe-js/pure'
import { shallowRef } from 'vue'

interface PublicStripeConfig {
  publishableKey?: string
  advancedFraudSignals?: boolean
  options?: Record<string, unknown>
}

const PROMISE_KEY = '_vueStripeClientPromise'

/**
 * Loads Stripe.js in the browser and returns it as a shallow ref.
 *
 * The ref stays `null` during server rendering, which is exactly what the
 * `<Elements>` `stripe` prop accepts for SSR. The script is requested on first
 * call rather than at import, and the resulting promise is shared across every
 * caller in the same Nuxt app.
 */
export function useClientStripe(): ShallowRef<Stripe | null> {
  const stripe = shallowRef<Stripe | null>(null)

  if (import.meta.server) {
    return stripe
  }

  const config = (useRuntimeConfig().public?.stripe ?? {}) as PublicStripeConfig

  if (!config.publishableKey) {
    throw new Error(
      '[vue-stripe] Missing Stripe publishable key. Set `stripe.publishableKey` in your nuxt.config, or provide the NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable.',
    )
  }

  const store = useNuxtApp() as unknown as Record<string, Promise<Stripe | null> | undefined>

  if (!store[PROMISE_KEY]) {
    if (config.advancedFraudSignals === false) {
      loadStripe.setLoadParameters({ advancedFraudSignals: false })
    }
    store[PROMISE_KEY] = loadStripe(config.publishableKey, config.options)
  }

  store[PROMISE_KEY].then((instance) => {
    stripe.value = instance
  })

  return stripe
}
