import type * as stripeJs from '@stripe/stripe-js'
import type { ComputedRef, InjectionKey, PropType, ShallowRef } from 'vue'
import { computed, defineComponent, inject, provide, shallowRef, watch, watchEffect } from 'vue'
import { ElementsContextKey, parseElementsContext } from '../../components/Elements'
import { parseStripeProp } from '../../utils/parseStripeProp'

export type State
  = | {
    type: 'loading'
    sdk: stripeJs.StripeCheckout | null
  }
  | {
    type: 'success'
    sdk: stripeJs.StripeCheckout
    checkoutActions: stripeJs.LoadActionsSuccess
    session: stripeJs.StripeCheckoutSession
  }
  | { type: 'error', error: { message: string } }

export interface CheckoutContextValue {
  stripe: ShallowRef<stripeJs.Stripe | null>
  checkoutState: ShallowRef<State>
}

export const CheckoutContextKey = Symbol('Checkout Context') as InjectionKey<CheckoutContextValue>

function validateCheckoutContext(ctx: CheckoutContextValue | null, useCase: string): CheckoutContextValue {
  if (!ctx) {
    throw new Error(
      `Could not find CheckoutProvider context; You need to wrap the part of your app that ${useCase} in a <CheckoutProvider> provider.`,
    )
  }
  return ctx
}

const INVALID_STRIPE_ERROR
  = 'Invalid prop `stripe` supplied to `CheckoutProvider`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.'

function maybeSdk(state: State): stripeJs.StripeCheckout | null {
  if (state.type === 'success' || state.type === 'loading') {
    return state.sdk
  }
  else {
    return null
  }
}

export const CheckoutProvider = defineComponent({
  inheritAttrs: false,
  name: 'CheckoutProvider',
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

    const state = shallowRef<State>({ type: 'loading', sdk: null })
    const stripe = shallowRef<stripeJs.Stripe | null>(null)

    // Used to avoid calling initCheckout multiple times when options changes
    let initCheckoutCalled = false

    watchEffect(() => {
      const init = ({ stripe }: { stripe: stripeJs.Stripe }) => {
        if (stripe && !initCheckoutCalled) {
          // Only update context if the component is still mounted
          // and stripe is not null. We allow stripe to be null to make
          // handling SSR easier.
          initCheckoutCalled = true
          const sdk = stripe.initCheckout(props.options)
          state.value = {
            type: 'loading',
            sdk,
          }

          sdk.loadActions()
            .then((result) => {
              if (result.type === 'success') {
                const { actions } = result
                state.value = {
                  type: 'success',
                  sdk,
                  checkoutActions: actions,
                  session: actions.getSession(),
                }

                sdk.on('change', (session) => {
                  if (state.value.type === 'success') {
                    state.value = {
                      ...state.value,
                      session,
                    }
                  }
                })
              }
              else {
                state.value = {
                  type: 'error',
                  error: result.error,
                }
              }
            })
            .catch((error) => {
              state.value = {
                type: 'error',
                error,
              }
            })
        }
      }

      if (parsed.value.tag === 'async') {
        parsed.value.stripePromise.then((newStripe) => {
          stripe.value = newStripe
          if (newStripe) {
            init({ stripe: newStripe })
          }
          else {
            // Only update context if the component is still mounted
            // and stripe is not null. We allow stripe to be null to make
            // handling SSR easier.
          }
        })
      }
      else if (parsed.value.tag === 'sync') {
        stripe.value = parsed.value.stripe
        init({ stripe: parsed.value.stripe })
      }
    })

    // Warn on changes to stripe prop
    watch(() => props.stripe, (_, prevStripe) => {
      if (prevStripe !== null) {
        console.warn(
          'Unsupported prop change on CheckoutProvider: You cannot change the `stripe` prop after setting it.',
        )
      }
    })

    const sdk = computed(() => maybeSdk(state.value))

    // Handle appearance changes
    watch(() => props.options.elementsOptions?.appearance, (appearance) => {
      if (sdk.value && appearance) {
        sdk.value.changeAppearance(appearance)
      }
    })

    // Handle fonts changes
    watch(() => props.options.elementsOptions?.fonts, (fonts) => {
      if (sdk.value && fonts) {
        sdk.value.loadFonts(fonts)
      }
    })

    provide(CheckoutContextKey, {
      checkoutState: state,
      stripe,
    })

    return () => slots.default?.()
  },
})

export function useElementsOrCheckoutContextWithUseCase(useCaseString: string) {
  const checkout = inject(CheckoutContextKey, null)
  const elements = inject(ElementsContextKey, null)

  if (checkout) {
    if (elements) {
      throw new Error(
        `You cannot wrap the part of your app that ${useCaseString} in both <CheckoutProvider> and <Elements> providers.`,
      )
    }
    else {
      return checkout
    }
  }
  else {
    return parseElementsContext(elements, useCaseString)
  }
}

type StripeCheckoutActions = Omit<
  stripeJs.StripeCheckout,
  'on' | 'loadActions'
>
& Omit<stripeJs.LoadActionsSuccess, 'getSession'>

export type StripeCheckoutValue = StripeCheckoutActions
  & stripeJs.StripeCheckoutSession

export type StripeUseCheckoutResult
  = | { type: 'loading' }
    | {
      type: 'success'
      checkout: StripeCheckoutValue
    }
    | { type: 'error', error: { message: string } }

function mapStateToUseCheckoutResult(checkoutState: State): StripeUseCheckoutResult {
  if (checkoutState.type === 'success') {
    const { sdk, session, checkoutActions } = checkoutState
    const { on: _on, loadActions: _loadActions, ...elementsMethods } = sdk
    const { getSession: _getSession, ...otherCheckoutActions } = checkoutActions
    const actions = {
      ...elementsMethods,
      ...otherCheckoutActions,
    }
    return {
      type: 'success',
      checkout: {
        ...session,
        ...actions,
      },
    }
  }
  else if (checkoutState.type === 'loading') {
    return {
      type: 'loading',
    }
  }
  else {
    return {
      type: 'error',
      error: checkoutState.error,
    }
  }
}

export function useCheckout(): ComputedRef<StripeUseCheckoutResult> {
  const ctx = inject(CheckoutContextKey, null)
  const { checkoutState } = validateCheckoutContext(ctx, 'calls useCheckout()')
  return computed(() => mapStateToUseCheckoutResult(checkoutState.value))
}
