import type * as stripeJs from '@stripe/stripe-js'
import type { DeepReadonly, InjectionKey, PropType, ShallowRef, SlotsType } from 'vue'
import { computed, defineComponent, inject, provide, readonly, shallowRef, watch } from 'vue'
import { createSnapshot } from '../utils/createSnapshot'
import { extractAllowedOptionsUpdates } from '../utils/extractAllowedOptionsUpdates'
import { parseStripeProp } from '../utils/parseStripeProp'
import { registerWithStripeJs } from '../utils/registerWithStripeJs'

export interface ElementsContextValue {
  stripe: DeepReadonly<ShallowRef<stripeJs.Stripe | null>>
  elements: DeepReadonly<ShallowRef<stripeJs.StripeElements | null>>
}

export const ElementsContextKey = Symbol('elements context') as InjectionKey<ElementsContextValue>

export function parseElementsContext(
  ctx: ElementsContextValue | null,
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
  name: 'Elements',
  props: {
    stripe: {
      type: [Object, null] as PropType<
        PromiseLike<stripeJs.Stripe | null> | stripeJs.Stripe | null
      >,
      required: true,
    },
    options: {
      type: Object as PropType<stripeJs.StripeElementsOptions>,
      required: false,
      default: () => ({}),
    },
  },
  slots: {} as SlotsType<{
    default: {
      stripe: stripeJs.Stripe | null
      elements: stripeJs.StripeElements | null
    }
  }>,
  setup(props, { slots }) {
    const parsed = computed(() => parseStripeProp(props.stripe))

    const ctx = {
      stripe: shallowRef(parsed.value.tag === 'sync' ? parsed.value.stripe : null),
      elements: shallowRef<stripeJs.StripeElements | null>(
        parsed.value.tag === 'sync'
          ? parsed.value.stripe.elements(props.options as Record<string, unknown>)
          : null,
      ),
    }

    if (parsed.value.tag === 'sync') {
      registerWithStripeJs(ctx.stripe)
    }

    const safeSetContext = (stripe: stripeJs.Stripe) => {
      // no-op if we already have a stripe instance
      if (ctx.stripe.value) {
        return
      }

      ctx.stripe.value = stripe
      ctx.elements.value = stripe.elements(props.options as Record<string, unknown>)
      registerWithStripeJs(ctx.stripe)
    }

    watch(
      parsed,
      (currentParsed, _, onCleanup) => {
        let cancelled = false
        onCleanup(() => {
          cancelled = true
        })

        // For an async stripePromise, store it in context once resolved
        if (currentParsed.tag === 'async' && !ctx.stripe.value) {
          currentParsed.stripePromise.then((loadedStripe) => {
            if (!cancelled && loadedStripe) {
              safeSetContext(loadedStripe)
            }
          })
        } else if (currentParsed.tag === 'sync' && !ctx.stripe.value) {
          // Or, handle a sync stripe instance going from null -> populated
          safeSetContext(currentParsed.stripe)
        }
      },
      { immediate: true },
    )

    // Warn on changes to stripe prop
    watch(
      () => props.stripe,
      (_, prevStripe) => {
        if (prevStripe !== null) {
          console.warn(
            'Unsupported prop change on Elements: You cannot change the `stripe` prop after setting it.',
          )
        }
      },
    )

    let previousOptionsSnapshot = createSnapshot(props.options)

    watch(
      () => props.options,
      (options) => {
        if (!ctx.elements.value) {
          previousOptionsSnapshot = createSnapshot(options)
          return
        }

        const nextOptionsSnapshot = createSnapshot(options)
        const updates = extractAllowedOptionsUpdates(nextOptionsSnapshot, previousOptionsSnapshot, [
          'clientSecret',
          'fonts',
        ])
        if (updates) {
          ctx.elements.value.update(updates)
        }

        previousOptionsSnapshot = nextOptionsSnapshot
      },
      { deep: true },
    )

    provide(ElementsContextKey, {
      stripe: readonly(ctx.stripe),
      elements: readonly(ctx.elements),
    })

    return () => slots.default?.({ stripe: ctx.stripe.value, elements: ctx.elements.value })
  },
})

export function useElementsContextWithUseCase(useCaseMessage: string): ElementsContextValue {
  const ctx = inject(ElementsContextKey, null)
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
