import type * as stripeJs from '@stripe/stripe-js'
import type { ComputedRef, DeepReadonly, PropType, ShallowRef } from 'vue'
import { computed, defineComponent, inject, provide, readonly, shallowRef, watch, watchEffect } from 'vue'
import { CheckoutKey, CheckoutSdkKey, ElementsKey } from '../keys'
import { parseStripeProp } from '../utils/parseStripeProp'
import { parseElementsContext } from './Elements'

export interface CheckoutSdkContextValue {
  checkoutSdk: DeepReadonly<ShallowRef<stripeJs.StripeCheckout | null>>
  stripe: DeepReadonly<ShallowRef<stripeJs.Stripe | null>>
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
      type: [Object, null] as PropType<PromiseLike<stripeJs.Stripe | null> | stripeJs.Stripe | null>,
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

    const ctx = {
      stripe: shallowRef<stripeJs.Stripe | null>(parsed.value.tag === 'sync' ? parsed.value.stripe : null),
      checkoutSdk: shallowRef<stripeJs.StripeCheckout | null>(null),
    }

    const safeSetContext = (
      stripe: stripeJs.Stripe,
      checkoutSdk: stripeJs.StripeCheckout,
    ) => {
      if (ctx.stripe.value && ctx.checkoutSdk.value) {
        return
      }

      ctx.stripe.value = stripe
      ctx.checkoutSdk.value = checkoutSdk
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
      const checkoutSdk = ctx.checkoutSdk.value
      if (!checkoutSdk) {
        return
      }

      if (appearance) {
        checkoutSdk.changeAppearance(appearance)
      }
    })

    watch(() => props.options.elementsOptions?.fonts, (fonts) => {
      const checkoutSdk = ctx.checkoutSdk.value
      if (!checkoutSdk) {
        return
      }

      if (fonts) {
        checkoutSdk.loadFonts(fonts)
      }
    })

    const checkoutContextValue = computed(() => extractCheckoutContextValue(ctx.checkoutSdk.value, session.value))

    provide(CheckoutKey, checkoutContextValue)
    provide(CheckoutSdkKey, {
      checkoutSdk: readonly(ctx.checkoutSdk),
      stripe: readonly(ctx.stripe),
    })

    return () => ctx.checkoutSdk.value ? slots.default?.() : null
  },
})

export function useElementsOrCheckoutSdkContextWithUseCase(useCaseString: string) {
  const checkoutSdkContext = inject(CheckoutSdkKey, undefined)
  const elementsContext = inject(ElementsKey, undefined)

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
  const ctx = inject(CheckoutSdkKey, undefined)
  return parseCheckoutSdkContext(ctx, useCaseString)
}

export function useCheckout(): ComputedRef<CheckoutContextValue | null> {
  // ensure it's in CheckoutProvider
  useCheckoutSdkContextWithUseCase('calls useCheckout()')
  const ctx = inject(CheckoutKey, undefined)
  if (!ctx) {
    throw new Error(
      'Could not find Checkout Context; You need to wrap the part of your app that calls useCheckout() in an <CheckoutProvider> provider.',
    )
  }
  return ctx
}
