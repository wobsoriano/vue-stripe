import type * as stripeJs from '@stripe/stripe-js'
import type { UnknownOptions } from '../types'
import { computed, defineComponent, inject, type PropType, provide, ref, type Ref, shallowRef, watchEffect } from 'vue'
import { EmbeddedCheckoutKey } from '../keys'
import { parseStripeProp } from '../utils/parseStripeProp'

interface EmbeddedCheckoutPublicInterface {
  mount(location: string | HTMLElement): void
  unmount(): void
  destroy(): void
}

export interface EmbeddedCheckoutContextValue {
  embeddedCheckout: EmbeddedCheckoutPublicInterface | null
}

export function useEmbeddedCheckoutContext(): Ref<EmbeddedCheckoutContextValue> {
  const ctx = inject(EmbeddedCheckoutKey, undefined)
  if (!ctx) {
    throw new Error(
      '<EmbeddedCheckout> must be used within <EmbeddedCheckoutProvider>',
    )
  }
  return ctx
};

const INVALID_STRIPE_ERROR
  = 'Invalid prop `stripe` supplied to `EmbeddedCheckoutProvider`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.'

export const EmbeddedCheckoutProvider = defineComponent({
  props: {
    stripe: {
      type: Object as PropType<stripeJs.Stripe | null>,
      required: true,
    },
    options: {
      type: Object as PropType<{
        clientSecret?: string | null
        fetchClientSecret?: (() => Promise<string>) | null
        onComplete?: () => void
        onShippingDetailsChange?: (
          event: stripeJs.StripeEmbeddedCheckoutShippingDetailsChangeEvent
        ) => Promise<stripeJs.ResultAction>
      }>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const parsed = computed(() => parseStripeProp(props.stripe, INVALID_STRIPE_ERROR))

    const embeddedCheckoutPromise = shallowRef<Promise<void> | null>(
      null,
    )
    const loadedStripe = shallowRef<stripeJs.Stripe | null>(null)

    const ctx = ref<EmbeddedCheckoutContextValue>({
      embeddedCheckout: null,
    })

    watchEffect((onInvalidate) => {
      // Don't support any ctx updates once embeddedCheckout or stripe is set.
      if (loadedStripe.value || embeddedCheckoutPromise.value) {
        return
      }

      const setStripeAndInitEmbeddedCheckout = (stripe: stripeJs.Stripe) => {
        if (loadedStripe.value || embeddedCheckoutPromise.value)
          return

        loadedStripe.value = stripe
        embeddedCheckoutPromise.value = loadedStripe.value
          .initEmbeddedCheckout(props.options as UnknownOptions)
          .then((embeddedCheckout) => {
            ctx.value.embeddedCheckout = embeddedCheckout
          })
      }

      // For an async stripePromise, store it once resolved
      if (
        parsed.value.tag === 'async'
        && !loadedStripe.value
        && (props.options.clientSecret || props.options.fetchClientSecret)
      ) {
        parsed.value.stripePromise.then((stripe) => {
          if (stripe) {
            setStripeAndInitEmbeddedCheckout(stripe)
          }
        })
      }
      else if (
        parsed.value.tag === 'sync'
        && !loadedStripe.value
        && (props.options.clientSecret || props.options.fetchClientSecret)
      ) {
        // Or, handle a sync stripe instance going from null -> populated
        setStripeAndInitEmbeddedCheckout(parsed.value.stripe)
      }

      onInvalidate(() => {
        if (ctx.value.embeddedCheckout) {
          embeddedCheckoutPromise.value = null
          ctx.value.embeddedCheckout.destroy()
        }
        else if (embeddedCheckoutPromise.value) {
          // If embedded checkout is still initializing, destroy it once
          // it's done. This could be caused by unmounting very quickly
          // after mounting.
          embeddedCheckoutPromise.value.then(() => {
            embeddedCheckoutPromise.value = null
            if (ctx.value.embeddedCheckout) {
              ctx.value.embeddedCheckout.destroy()
            }
          })
        }
      })
    })

    provide(EmbeddedCheckoutKey, ctx)

    return () => slots.default?.()
  },
})
