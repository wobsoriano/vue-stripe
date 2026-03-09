import type * as stripeJs from '@stripe/stripe-js'
import type { ShallowRef } from 'vue'

declare const _VERSION: string
declare const _NAME: string

export function registerWithStripeJs(stripe: ShallowRef<stripeJs.Stripe | null>): void {
  const instance = stripe.value as any
  if (!instance || !instance._registerWrapper || !instance.registerAppInfo) {
    return
  }

  instance._registerWrapper({ name: _NAME, version: _VERSION })

  instance.registerAppInfo({
    name: _NAME,
    version: _VERSION,
    url: 'https://github.com/wobsoriano/vue-stripe',
  })
}
