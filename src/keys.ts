import type { Stripe, StripeElements } from '@stripe/stripe-js'
import type { InjectionKey, Ref, ShallowRef } from 'vue'
import type { CustomCheckoutContextValue } from './components/CustomCheckout'

export const ElementsKey = Symbol('stripe elements') as InjectionKey<{
  stripe: Ref<Stripe | null>
  elements: ShallowRef<StripeElements | null>
}>

export const CustomCheckoutKey = Symbol('custom checkout') as InjectionKey<ComputedRef<CustomCheckoutContextValue | null>>
