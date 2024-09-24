import type * as stripeJs from '@stripe/stripe-js'
import type { Ref, ShallowRef } from 'vue'
import { defineComponent, inject, provide, shallowRef, toRef, watchEffect } from 'vue'
import { ElementsKey } from '../keys'

export interface ElementsContextValue {
  stripe: Ref<stripeJs.Stripe | null>
  elements: ShallowRef<stripeJs.StripeElements | null>
}

export function parseElementsContext(
  ctx: ElementsContextValue | undefined,
  useCase: string,
): ElementsContextValue {
  if (!ctx) {
    throw new Error(
      `Could not find Elements context; You need to wrap the part of your app that ${useCase} in an <Elements> provider.`,
    )
  }

  return ctx
}

export const Elements = defineComponent((props: {
  stripe: stripeJs.Stripe | null
  options?: stripeJs.StripeElementsOptions
}, { slots }) => {
  const elements = shallowRef<stripeJs.StripeElements | null>(null)

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

  return () => slots.default?.()
}, {
  props: ['stripe', 'options'],
})

export function useElementsContextWithUseCase(useCaseMessage: string): ElementsContextValue {
  const ctx = inject(ElementsKey)
  return parseElementsContext(ctx, useCaseMessage)
}

/**
 * To safely pass the payment information collected by the
 * Payment Element to the Stripe API, access the Elements
 * instance so that you can use it with [stripe.confirmPayment](https://docs.stripe.com/js/payment_intents/confirm_payment)
 */
export function useElements() {
  const { elements } = useElementsContextWithUseCase('calls useElements()')
  return elements
}
