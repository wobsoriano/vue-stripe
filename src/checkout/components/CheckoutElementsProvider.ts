import type * as stripeJs from '@stripe/stripe-js'
import type { PropType } from 'vue'
import type { CheckoutState } from './CheckoutContext'
import { computed, defineComponent, provide, shallowRef, watch } from 'vue'
import { createSnapshot } from '../../utils/createSnapshot'
import { isEqual } from '../../utils/isEqual'
import { parseStripeProp } from '../../utils/parseStripeProp'
import { registerWithStripeJs } from '../../utils/registerWithStripeJs'
import { CheckoutContextKey } from './CheckoutContext'

const INVALID_STRIPE_ERROR
  = 'Invalid prop `stripe` supplied to `CheckoutElementsProvider`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.'

function maybeSdk(state: CheckoutState): stripeJs.StripeCheckoutElementsSdk | null {
  if (state.type === 'success' || state.type === 'loading') {
    return state.sdk as stripeJs.StripeCheckoutElementsSdk | null
  }
  return null
}

export const CheckoutElementsProvider = defineComponent({
  inheritAttrs: false,
  name: 'CheckoutElementsProvider',
  props: {
    stripe: {
      type: [Object, null] as PropType<PromiseLike<stripeJs.Stripe | null> | stripeJs.Stripe | null>,
      required: true,
    },
    options: {
      type: Object as PropType<stripeJs.StripeCheckoutElementsSdkOptions>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const parsed = computed(() => parseStripeProp(props.stripe, INVALID_STRIPE_ERROR))
    const state = shallowRef<CheckoutState>({ type: 'loading', sdk: null })
    const stripe = shallowRef<stripeJs.Stripe | null>(null)

    // Guards against re-initializing when the `parsed` watcher re-fires, which
    // happens on a `stripe` prop transition, not on an options change (the
    // watcher only tracks `parsed`, which is derived from `props.stripe`).
    let initCalled = false

    watch(parsed, (currentParsed, _, onCleanup) => {
      let cancelled = false
      onCleanup(() => {
        cancelled = true
      })

      const init = (loadedStripe: stripeJs.Stripe) => {
        if (!loadedStripe || initCalled) {
          return
        }

        initCalled = true
        const sdk = loadedStripe.initCheckoutElementsSdk(props.options)
        state.value = { type: 'loading', sdk }

        sdk.loadActions()
          .then((result) => {
            if (cancelled) {
              return
            }

            if (result.type === 'success') {
              const { actions } = result
              state.value = {
                type: 'success',
                sdkKind: 'elements',
                sdk,
                checkoutActions: actions,
                session: actions.getSession(),
              }

              sdk.on('change', (session) => {
                if (state.value.type === 'success' && state.value.sdkKind === 'elements') {
                  state.value = { ...state.value, session }
                }
              })
            }
            else {
              state.value = { type: 'error', error: result.error }
            }
          })
          .catch((error) => {
            if (!cancelled) {
              state.value = { type: 'error', error }
            }
          })
      }

      if (currentParsed.tag === 'async') {
        currentParsed.stripePromise.then((newStripe) => {
          if (cancelled) {
            return
          }
          stripe.value = newStripe
          if (newStripe) {
            registerWithStripeJs(stripe)
            init(newStripe)
          }
        })
      }
      else if (currentParsed.tag === 'sync') {
        stripe.value = currentParsed.stripe
        registerWithStripeJs(stripe)
        init(currentParsed.stripe)
      }
    }, { immediate: true })

    watch(() => props.stripe, (_, prevStripe) => {
      if (prevStripe !== null) {
        console.warn(
          'Unsupported prop change on CheckoutElementsProvider: You cannot change the `stripe` prop after setting it.',
        )
      }
    })

    const sdk = computed(() => maybeSdk(state.value))

    let previousAppearance = createSnapshot(props.options.elementsOptions?.appearance)
    watch(() => props.options.elementsOptions?.appearance, (appearance) => {
      const next = createSnapshot(appearance)
      if (sdk.value && appearance && !isEqual(next, previousAppearance)) {
        sdk.value.changeAppearance(appearance)
      }
      previousAppearance = next
    }, { deep: true })

    let previousFonts = createSnapshot(props.options.elementsOptions?.fonts)
    watch(() => props.options.elementsOptions?.fonts, (fonts) => {
      const next = createSnapshot(fonts)
      if (sdk.value && fonts && !isEqual(next, previousFonts)) {
        sdk.value.loadFonts(fonts)
      }
      previousFonts = next
    }, { deep: true })

    provide(CheckoutContextKey, { checkoutState: state, stripe })

    return () => slots.default?.()
  },
})
