import type * as stripeJs from '@stripe/stripe-js'
import type { ComputedRef, PropType } from 'vue'
import { computed, defineComponent, inject, provide, reactive, shallowRef, watch, watchEffect } from 'vue'
import { CheckoutKey, CheckoutSdkKey, ElementsKey } from '../keys'
import { parseStripeProp } from '../utils/parseStripeProp'
import { parseElementsContext } from './Elements'

export interface CheckoutSdkContextValue {
  checkoutSdk: ComputedRef<stripeJs.StripeCheckout | null>
  stripe: ComputedRef<stripeJs.Stripe | null>
}

export function parseCheckoutSdkContext(
  ctx: CheckoutSdkContextValue | undefined,
  useCase: string,
): CheckoutSdkContextValue {
  if (!ctx) {
    throw new Error(
      `Could not find CheckoutProvider context; You need to wrap the part of your app that ${useCase} in an <CheckoutProvider> provider.`,
    )
  }

  return ctx
}

type StripeCheckoutActions = Omit<Omit<stripeJs.StripeCheckout, 'session'>, 'on'>

export interface CheckoutContextValue extends StripeCheckoutActions, stripeJs.StripeCheckoutSession {}

export function extractCheckoutContextValue(
  checkoutSdk: stripeJs.StripeCheckout | null,
  sessionState: stripeJs.StripeCheckoutSession | null,
): CheckoutContextValue | null {
  if (!checkoutSdk) {
    return null
  }

  const { on: _on, session: _session, ...actions } = checkoutSdk
  if (!sessionState) {
    return Object.assign(checkoutSdk.session(), actions)
  }

  return Object.assign(sessionState, actions)
}

const INVALID_STRIPE_ERROR
  = 'Invalid prop `stripe` supplied to `CheckoutProvider`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.'

export const CheckoutProvider = defineComponent({
  inheritAttrs: false,
  props: {
    stripe: {
      type: Object as PropType<stripeJs.Stripe | null>,
      required: true,
    },
    options: {
      type: Object as PropType<stripeJs.StripeCheckoutOptions>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const parsed = computed(() => parseStripeProp(props.stripe, INVALID_STRIPE_ERROR))

    const session = shallowRef<stripeJs.StripeCheckoutSession | null>(null)

    const ctx = reactive<{
      stripe: stripeJs.Stripe | null
      checkoutSdk: stripeJs.StripeCheckout | null
    }>({
      stripe: parsed.value.tag === 'sync' ? parsed.value.stripe : null,
      checkoutSdk: null,
    })

    const safeSetContext = (
      stripe: stripeJs.Stripe,
      checkoutSdk: stripeJs.StripeCheckout,
    ) => {
      if (ctx.stripe && ctx.checkoutSdk) {
        return
      }

      ctx.stripe = stripe
      ctx.checkoutSdk = checkoutSdk
    }

    watchEffect(() => {
      if (parsed.value.tag === 'async' && !ctx.stripe) {
        parsed.value.stripePromise.then((stripe) => {
          if (stripe) {
            stripe.initCheckout(props.options).then((checkoutSdk) => {
              if (checkoutSdk) {
                safeSetContext(stripe, checkoutSdk)
                checkoutSdk.on('change', (payload) => {
                  session.value = payload
                })
              }
            })
          }
        })
      }
      else if (
        parsed.value.tag === 'sync'
        && parsed.value.stripe
      ) {
        parsed.value.stripe.initCheckout(props.options).then((checkoutSdk) => {
          if (checkoutSdk) {
            // @ts-expect-error - stripe type is missing
            safeSetContext(parsed.value.stripe, checkoutSdk)
            checkoutSdk.on('change', (payload) => {
              session.value = payload
            })
          }
        })
      }
    })

    watch(() => props.options.elementsOptions?.appearance, (appearance) => {
      if (!ctx.checkoutSdk) {
        return
      }

      if (appearance) {
        ctx.checkoutSdk.changeAppearance(appearance)
      }
    })

    watch(() => props.options.elementsOptions?.fonts, (fonts) => {
      if (!ctx.checkoutSdk) {
        return
      }

      if (fonts) {
        ctx.checkoutSdk.loadFonts(fonts)
      }
    })

    const checkoutContextValue = computed(() => extractCheckoutContextValue(ctx.checkoutSdk, session.value))

    provide(CheckoutKey, checkoutContextValue)
    provide(CheckoutSdkKey, {
      checkoutSdk: computed(() => ctx.checkoutSdk),
      stripe: computed(() => props.stripe),
    })

    return () => slots.default?.()
  },
})

export function useElementsOrCheckoutSdkContextWithUseCase(useCaseString: string) {
  const checkoutSdkContext = inject(CheckoutSdkKey)
  const elementsContext = inject(ElementsKey)

  if (checkoutSdkContext && elementsContext) {
    throw new Error(
      `You cannot wrap the part of your app that ${useCaseString} in both <CheckoutProvider> and <Elements> providers.`,
    )
  }

  if (checkoutSdkContext) {
    return parseCheckoutSdkContext(checkoutSdkContext, useCaseString)
  }

  return parseElementsContext(elementsContext, useCaseString)
}

export function useCheckoutSdkContextWithUseCase(useCaseString: string): CheckoutSdkContextValue {
  const ctx = inject(CheckoutSdkKey)
  return parseCheckoutSdkContext(ctx, useCaseString)
}

export function useCheckout(): ComputedRef<CheckoutContextValue | null> {
  // ensure it's in CheckoutProvider
  useCheckoutSdkContextWithUseCase('calls useCheckout()')
  const ctx = inject(CheckoutKey)
  if (!ctx) {
    throw new Error(
      'Could not find Checkout Context; You need to wrap the part of your app that calls useCheckout() in an <CheckoutProvider> provider.',
    )
  }
  return ctx
}
