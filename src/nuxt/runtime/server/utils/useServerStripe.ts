import type { H3Event } from 'h3'
import type Stripe from 'stripe'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore `#imports` is provided by Nitro at build time.
import { useRuntimeConfig } from '#imports'

interface ServerStripeConfig {
  secretKey?: string
  apiVersion?: string
  options?: Record<string, unknown>
}

let cached: { key: string, client: Stripe } | null = null

/**
 * Returns a lazily constructed Stripe Node client for the current request.
 *
 * The `stripe` package is an optional peer dependency and is imported on first
 * use, so client-only projects never load it. The instance is cached for the
 * lifetime of the server process and rebuilt if the secret key changes.
 */
export async function useServerStripe(event: H3Event): Promise<Stripe> {
  const config = useRuntimeConfig(event).stripe as ServerStripeConfig | undefined
  const secretKey = config?.secretKey

  if (!secretKey) {
    throw new Error(
      '[vue-stripe] Missing Stripe secret key. Set `stripe.secretKey` in your nuxt.config runtimeConfig, or provide the NUXT_STRIPE_SECRET_KEY environment variable.',
    )
  }

  if (cached && cached.key === secretKey) {
    return cached.client
  }

  let StripeConstructor: new (key: string, options?: Record<string, unknown>) => Stripe

  try {
    StripeConstructor = (await import('stripe')).default as unknown as typeof StripeConstructor
  }
  catch {
    throw new Error(
      '[vue-stripe] The `stripe` package is required by useServerStripe() but is not installed. Install it with `npm install stripe`.',
    )
  }

  const client = new StripeConstructor(secretKey, {
    ...(config?.apiVersion ? { apiVersion: config.apiVersion } : {}),
    ...config?.options,
  })

  cached = { key: secretKey, client }

  return client
}
