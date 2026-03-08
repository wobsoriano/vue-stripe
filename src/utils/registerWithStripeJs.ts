import type * as stripeJs from '@stripe/stripe-js'
import type { ShallowRef } from 'vue'

declare const _VERSION: string

export function registerWithStripeJs(stripe: ShallowRef<stripeJs.Stripe | null>): void {
  const instance = stripe.value as any
  if (!instance || !instance._registerWrapper || !instance.registerAppInfo) {
    return
  }

  instance._registerWrapper({ name: 'vue-stripe', version: _VERSION })

  instance.registerAppInfo({
    name: 'vue-stripe',
    version: _VERSION,
    url: 'https://github.com/wobsoriano/vue-stripe',
  })
}
