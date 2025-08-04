import type * as stripeJs from '@stripe/stripe-js'
import type { ComputedRef, PropType } from 'vue'
import type { UnknownOptions } from '../types'
import { computed, defineComponent, inject, provide, shallowRef, watch, watchEffect } from 'vue'
import { ElementsKey } from '../keys'
import { parseStripeProp } from '../utils/parseStripeProp'

export interface ElementsContextValue {
  stripe: ComputedRef<stripeJs.Stripe | null>
  elements: ComputedRef<stripeJs.StripeElements | null>
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

export const Elements = defineComponent({
  props: {
    stripe: {
      type: Object as PropType<stripeJs.Stripe | null>,
      required: true,
    },
    options: {
      type: Object as PropType<stripeJs.StripeElementsOptions>,
      required: false,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const parsed = computed(() => parseStripeProp(props.stripe))

    const stripe = shallowRef(
      parsed.value.tag === 'sync' ? parsed.value.stripe : null,
    )
    const elements = shallowRef<stripeJs.StripeElements | null>(
      parsed.value.tag === 'sync'
        ? parsed.value.stripe.elements(
          props.options as UnknownOptions,
        )
        : null,
    )

    watchEffect(() => {
      // For an async stripePromise, store it in context once resolved
      if (parsed.value.tag === 'async' && !stripe.value) {
        parsed.value.stripePromise.then((loadedStripe) => {
          if (loadedStripe) {
            stripe.value = loadedStripe
            elements.value = loadedStripe.elements(props.options as UnknownOptions)
          }
        })
      }
      else if (parsed.value.tag === 'sync' && !stripe.value) {
        // Or, handle a sync stripe instance going from null -> populated
        stripe.value = parsed.value.stripe
        elements.value = parsed.value.stripe.elements(props.options as UnknownOptions)
      }
    })

    watch(() => {
      const { clientSecret, fonts, ...rest } = props.options ?? {}
      return rest
    }, (stripeElementUpdateOptions) => {
      if (!elements.value) {
        return
      }

      elements.value.update(stripeElementUpdateOptions)
    }, { deep: true })

    provide(ElementsKey, {
      stripe: computed(() => stripe.value),
      elements: computed(() => elements.value),
    })

    return () => slots.default?.()
  },
})

export function useElementsContextWithUseCase(useCaseMessage: string): ElementsContextValue {
  const ctx = inject(ElementsKey, undefined)
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
