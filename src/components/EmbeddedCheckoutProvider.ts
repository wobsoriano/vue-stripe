import type * as stripeJs from '@stripe/stripe-js'
import type { InjectionKey, PropType, ShallowRef } from 'vue'
import type { UnknownOptions } from '../types'
import { computed, defineComponent, inject, onUnmounted, provide, shallowRef, watch } from 'vue'
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
  const ctx = inject(EmbeddedCheckoutContextKey, null)
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
          event: stripeJs.StripeEmbeddedCheckoutShippingDetailsChangeEvent,
        ) => Promise<stripeJs.ResultAction>
        onLineItemsChange?: (
          event: stripeJs.StripeEmbeddedCheckoutLineItemsChangeEvent,
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

    watch([parsed, () => props.options], ([currentParsed, currentOptions], _, onCleanup) => {
      let cancelled = false
      onCleanup(() => {
        cancelled = true
      })

      // Don't support any ctx updates once embeddedCheckout or stripe is set.
      if (loadedStripe.value || embeddedCheckoutPromise.value) {
        return
      }

      const setStripeAndInitEmbeddedCheckout = (stripe: stripeJs.Stripe) => {
        if (cancelled || loadedStripe.value || embeddedCheckoutPromise.value)
          return

        loadedStripe.value = stripe
        embeddedCheckoutPromise.value = loadedStripe.value
          .initEmbeddedCheckout(currentOptions as UnknownOptions)
          .then((embeddedCheckout) => {
            if (cancelled) {
              embeddedCheckout.destroy()
              embeddedCheckoutPromise.value = null
              return
            }

            ctx.embeddedCheckout.value = embeddedCheckout
          })
      }

      // For an async stripePromise, store it once resolved
      if (
        currentParsed.tag === 'async'
        && !loadedStripe.value
        && (currentOptions.clientSecret || currentOptions.fetchClientSecret)
      ) {
        currentParsed.stripePromise.then((stripe) => {
          if (!cancelled && stripe) {
            setStripeAndInitEmbeddedCheckout(stripe)
          }
        })
      }
      else if (
        currentParsed.tag === 'sync'
        && !loadedStripe.value
        && (currentOptions.clientSecret || currentOptions.fetchClientSecret)
      ) {
        // Or, handle a sync stripe instance going from null -> populated
        setStripeAndInitEmbeddedCheckout(currentParsed.stripe)
      }
    }, { immediate: true, deep: true })

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

    provide(EmbeddedCheckoutContextKey, ctx)

    // Warn on changes to stripe prop
    watch(() => props.stripe, (_, prevStripe) => {
      if (prevStripe !== null) {
        console.warn(
          'Unsupported prop change on EmbeddedCheckoutProvider: You cannot change the `stripe` prop after setting it.',
        )
      }
    })

    // Warn on changes to immutable options
    watch(() => props.options, (options, prevOptions) => {
      if (prevOptions == null)
        return

      if (options == null) {
        console.warn(
          'Unsupported prop change on EmbeddedCheckoutProvider: You cannot unset options after setting them.',
        )
        return
      }

      if (options.clientSecret === undefined && options.fetchClientSecret === undefined) {
        console.warn(
          'Invalid props passed to EmbeddedCheckoutProvider: You must provide one of either `options.fetchClientSecret` or `options.clientSecret`.',
        )
      }

      if (prevOptions.clientSecret != null && options.clientSecret !== prevOptions.clientSecret) {
        console.warn(
          'Unsupported prop change on EmbeddedCheckoutProvider: You cannot change the client secret after setting it. Unmount and create a new instance of EmbeddedCheckoutProvider instead.',
        )
      }

      if (prevOptions.fetchClientSecret != null && options.fetchClientSecret !== prevOptions.fetchClientSecret) {
        console.warn(
          'Unsupported prop change on EmbeddedCheckoutProvider: You cannot change fetchClientSecret after setting it. Unmount and create a new instance of EmbeddedCheckoutProvider instead.',
        )
      }

      if (prevOptions.onComplete != null && options.onComplete !== prevOptions.onComplete) {
        console.warn(
          'Unsupported prop change on EmbeddedCheckoutProvider: You cannot change the onComplete option after setting it.',
        )
      }

      if (prevOptions.onShippingDetailsChange != null && options.onShippingDetailsChange !== prevOptions.onShippingDetailsChange) {
        console.warn(
          'Unsupported prop change on EmbeddedCheckoutProvider: You cannot change the onShippingDetailsChange option after setting it.',
        )
      }

      if (prevOptions.onLineItemsChange != null && options.onLineItemsChange !== prevOptions.onLineItemsChange) {
        console.warn(
          'Unsupported prop change on EmbeddedCheckoutProvider: You cannot change the onLineItemsChange option after setting it.',
        )
      }
    })

    return () => slots.default?.()
  },
})
