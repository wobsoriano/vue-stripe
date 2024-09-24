import type { StripeElement } from '@stripe/stripe-js'
import type { ShallowRef } from 'vue'
import { inject, watchEffect } from 'vue'
import { ElementsKey } from '../keys'

/**
 * The useStripe composable returns a reference to the [Stripe](https://docs.stripe.com/js/initializing)
 * instance passed to the Elements provider.
 */
export function useStripe() {
  const elements = inject(ElementsKey)

  if (!elements) {
    throw new Error(`Could not find Elements context; You need to wrap the part of your app that calls useStripe in an <Elements> provider.`)
  }

  return elements.stripe
}

/**
 * To safely pass the payment information collected by the
 * Payment Element to the Stripe API, access the Elements
 * instance so that you can use it with [stripe.confirmPayment](https://docs.stripe.com/js/payment_intents/confirm_payment)
 */
export function useElements() {
  const elements = inject(ElementsKey)

  if (!elements) {
    throw new Error(`Could not find Elements context; You need to wrap the part of your app that calls useElements in an <Elements> provider.`)
  }

  return elements.elements
}

export function useAttachEvent(
  element: ShallowRef<StripeElement | null>,
  event: string,
  emit: (event: any, ...args: unknown[]) => void,
  shouldEmitElement = false,
) {
  watchEffect((onInvalidate) => {
    if (!element.value) {
      return
    }

    function cbWithEmit(...args: unknown[]) {
      if (shouldEmitElement) {
        emit(event, element.value)
      }
      else {
        emit(event, ...args)
      }
    }

    ;(element.value as any).on(event, cbWithEmit)

    onInvalidate(() => {
      ;(element.value as any).off(event, cbWithEmit)
    })
  })
}
