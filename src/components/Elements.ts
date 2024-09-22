import type { Stripe, StripeElements, StripeElementsOptions } from '@stripe/stripe-js'
import type { UnknownOptions } from '../types'
import { computed, defineComponent, provide, shallowRef, watchEffect } from 'vue'
import { ElementsKey } from '../keys'

export const Elements = defineComponent((props: {
  stripe: Stripe | null
  options?: StripeElementsOptions
}, { slots }) => {
  const elements = shallowRef<StripeElements | null>(null)

  watchEffect(() => {
    if (props.stripe) {
      const instance = props.stripe.elements(props.options as UnknownOptions)
      elements.value = instance
    }
  })

  provide(ElementsKey, {
    stripe: computed(() => props.stripe),
    elements,
  })

  return () => slots.default?.()
}, {
  props: ['stripe', 'options'],
})
