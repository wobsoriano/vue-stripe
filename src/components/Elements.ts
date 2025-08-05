import type * as stripeJs from '@stripe/stripe-js'
import type { DeepReadonly, PropType, ShallowRef } from 'vue'
import type { UnknownOptions } from '../types'
import { computed, defineComponent, inject, provide, readonly, shallowRef, watch, watchEffect } from 'vue'
import { ElementsKey } from '../keys'
import { parseStripeProp } from '../utils/parseStripeProp'

export interface ElementsContextValue {
  stripe: DeepReadonly<ShallowRef<stripeJs.Stripe | null>>
  elements: DeepReadonly<ShallowRef<stripeJs.StripeElements | null>>
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
      type: [Object, null] as PropType<PromiseLike<stripeJs.Stripe | null> | stripeJs.Stripe | null>,
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

    const ctx = {
      stripe: shallowRef(parsed.value.tag === 'sync' ? parsed.value.stripe : null),
      elements: shallowRef<stripeJs.StripeElements | null>(parsed.value.tag === 'sync'
        ? parsed.value.stripe.elements(
          props.options as UnknownOptions,
        )
        : null),
    }

    watchEffect(() => {
      // For an async stripePromise, store it in context once resolved
      if (parsed.value.tag === 'async' && !ctx.stripe.value) {
        parsed.value.stripePromise.then((loadedStripe) => {
          if (loadedStripe) {
            ctx.stripe.value = loadedStripe
            ctx.elements.value = loadedStripe.elements(props.options as UnknownOptions)
          }
        })
      }
      else if (parsed.value.tag === 'sync' && !ctx.stripe.value) {
        // Or, handle a sync stripe instance going from null -> populated
        ctx.stripe.value = parsed.value.stripe
        ctx.elements.value = parsed.value.stripe.elements(props.options as UnknownOptions)
      }
    })

    watch(() => {
      const { clientSecret, fonts, ...rest } = props.options ?? {}
      return rest
    }, (stripeElementUpdateOptions) => {
      if (!ctx.elements.value) {
        return
      }

      ctx.elements.value.update(stripeElementUpdateOptions)
    }, { deep: true })

    provide(ElementsKey, {
      stripe: readonly(ctx.stripe),
      elements: readonly(ctx.elements),
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
