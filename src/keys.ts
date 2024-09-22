import type { Stripe, StripeElements } from '@stripe/stripe-js'
import type { ComputedRef, InjectionKey, ShallowRef } from 'vue'

export const ElementsKey = Symbol('stripe elements') as InjectionKey<{
  stripe: ComputedRef<Stripe | null>
  elements: ShallowRef<StripeElements | null>
}>
