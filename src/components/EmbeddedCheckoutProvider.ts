import type * as stripeJs from '@stripe/stripe-js'
import type { InjectionKey, PropType, ShallowRef } from 'vue'
import type { UnknownOptions } from '../types'
import { computed, defineComponent, inject, onUnmounted, provide, shallowRef, watchEffect } from 'vue'
import { parseStripeProp } from '../utils/parseStripeProp'

interface EmbeddedCheckoutPublicInterface {
  mount: (location: string | HTMLElement) => void
  unmount: () => void
  destroy: () => void
}

export interface EmbeddedCheckoutContextValue {
  embeddedCheckout: ShallowRef<EmbeddedCheckoutPublicInterface | null>
}

export const EmbeddedCheckoutContextKey = Symbol('embedded checkout context') as InjectionKey<EmbeddedCheckoutContextValue>

export function useEmbeddedCheckoutContext(): EmbeddedCheckoutContextValue {
  const ctx = inject(EmbeddedCheckoutContextKey, undefined)
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
  name: 'EmbeddedCheckoutProvider',
  props: {
    stripe: {
      type: [Object, null] as PropType<PromiseLike<stripeJs.Stripe | null> | stripeJs.Stripe | null>,
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

    const ctx = {
      embeddedCheckout: shallowRef<EmbeddedCheckoutPublicInterface | null>(null),
    }

    watchEffect(() => {
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
            ctx.embeddedCheckout.value = embeddedCheckout
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
    })

    onUnmounted(() => {
      if (ctx.embeddedCheckout.value) {
        embeddedCheckoutPromise.value = null
        ctx.embeddedCheckout.value.destroy()
      }
      else if (embeddedCheckoutPromise.value) {
        // If embedded checkout is still initializing, destroy it once
        // it's done. This could be caused by unmounting very quickly
        // after mounting.
        embeddedCheckoutPromise.value.then(() => {
          embeddedCheckoutPromise.value = null
          if (ctx.embeddedCheckout.value) {
            ctx.embeddedCheckout.value.destroy()
          }
        })
      }
    })

    provide(useEmbeddedCheckoutContext, ctx)

    return () => slots.default?.()
  },
})
