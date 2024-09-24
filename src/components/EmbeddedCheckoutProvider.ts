import type * as stripeJs from '@stripe/stripe-js'
import { defineComponent, inject, provide, ref, type Ref, watchEffect } from 'vue'
import { EmbeddedCheckoutKey } from '../keys'

interface EmbeddedCheckoutPublicInterface {
  mount(location: string | HTMLElement): void
  unmount(): void
  destroy(): void
}

export interface EmbeddedCheckoutContextValue {
  embeddedCheckout: EmbeddedCheckoutPublicInterface | null
}

export function useEmbeddedCheckoutContext(): Ref<EmbeddedCheckoutContextValue> {
  const ctx = inject(EmbeddedCheckoutKey)
  if (!ctx) {
    throw new Error(
      '<EmbeddedCheckout> must be used within <EmbeddedCheckoutProvider>',
    )
  }
  return ctx
};

interface EmbeddedCheckoutProviderProps {
  /**
   * A [Stripe object](https://stripe.com/docs/js/initializing).
   * The easiest way to initialize a `Stripe` object is with the the
   * [Stripe.js wrapper module](https://github.com/stripe/stripe-js/blob/master/README.md#readme).
   * Once this prop has been set, it can not be changed.
   *
   * You can also pass in `null` if you are
   * performing an initial server-side render or when generating a static site.
   */
  stripe: stripeJs.Stripe | null
  /**
   * Embedded Checkout configuration options.
   * You can initially pass in `null` to `options.clientSecret` or
   * `options.fetchClientSecret` if you are performing an initial server-side
   * render or when generating a static site.
   */
  options: {
    clientSecret?: string | null
    fetchClientSecret?: (() => Promise<string>) | null
    onComplete?: () => void
    onShippingDetailsChange?: (
      event: stripeJs.StripeEmbeddedCheckoutShippingDetailsChangeEvent
    ) => Promise<stripeJs.ResultAction>
  }
}

export const EmbeddedCheckoutProvider = defineComponent((props: EmbeddedCheckoutProviderProps, { slots }) => {
  const ctx = ref<EmbeddedCheckoutContextValue>({
    embeddedCheckout: null,
  })

  watchEffect((onInvalidate) => {
    if (props.stripe) {
      props.stripe.initEmbeddedCheckout(props.options as any).then((embeddedCheckout) => {
        ctx.value.embeddedCheckout = embeddedCheckout
      })
    }

    onInvalidate(() => {
      ctx.value.embeddedCheckout?.destroy()
    })
  })

  provide(EmbeddedCheckoutKey, ctx)

  return () => slots.default?.()
})
