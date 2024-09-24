import type { Stripe, StripeElements, StripeElementsOptions } from '@stripe/stripe-js'
import { defineComponent, provide, shallowRef, toRef, watchEffect } from 'vue'
import { ElementsKey } from '../keys'

export const Elements = defineComponent((props: {
  stripe: Stripe | null
  options?: StripeElementsOptions
}, { slots }) => {
  const elements = shallowRef<StripeElements | null>(null)

  watchEffect(() => {
    if (props.stripe) {
      const instance = props.stripe.elements(props.options as any)
      elements.value = instance
    }
  })

  const wrappedStripe = toRef(props, 'stripe')

  provide(ElementsKey, {
    stripe: wrappedStripe,
    elements,
  })

  return () => slots.default?.({ stripe: wrappedStripe, elements })
}, {
  props: ['stripe', 'options'],
})
