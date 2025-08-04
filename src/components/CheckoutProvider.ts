import type * as stripeJs from '@stripe/stripe-js'
import type { ComputedRef, PropType, Ref } from 'vue'
import { computed, defineComponent, inject, provide, shallowRef, watch, watchEffect } from 'vue'
import { CheckoutKey, CheckoutSdkKey, ElementsKey } from '../keys'
import { parseElementsContext } from './Elements'

export interface CheckoutSdkContextValue {
  checkoutSdk: Ref<stripeJs.StripeCheckout | null>
  stripe: Ref<stripeJs.Stripe | null>
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
    const checkoutSdk = shallowRef<stripeJs.StripeCheckout | null>(null)
    const session = shallowRef<stripeJs.StripeCheckoutSession | null>(null)

    watchEffect(() => {
      if (props.stripe && !checkoutSdk.value) {
        props.stripe.initCheckout(props.options).then((value) => {
          if (value) {
            checkoutSdk.value = value
            checkoutSdk.value.on('change', (value) => {
              session.value = value
            })
          }
        })
      }
    })

    watch(() => props.options.elementsOptions?.appearance, (appearance) => {
      if (!checkoutSdk.value || !appearance) {
        return
      }

      checkoutSdk.value.changeAppearance(appearance)
    })

    const checkoutContextValue = computed(() => extractCheckoutContextValue(checkoutSdk.value, session.value))

    provide(CheckoutKey, checkoutContextValue)
    provide(CheckoutSdkKey, {
      checkoutSdk,
      stripe: computed(() => props.stripe),
    })

    return () => slots.default?.()
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
