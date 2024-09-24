import type * as stripeJs from '@stripe/stripe-js'
import type { Ref } from 'vue'
import { computed, defineComponent, inject, provide, ref, toRef, watchEffect } from 'vue'
import { CustomCheckoutKey, CustomCheckoutSdkKey, ElementsKey } from '../keys'
import { parseElementsContext } from './Elements'

export interface CustomCheckoutSdkContextValue {
  customCheckoutSdk: Ref<stripeJs.StripeCustomCheckout | null>
  stripe: Ref<stripeJs.Stripe | null>
}

export function parseCustomCheckoutSdkContext(
  ctx: CustomCheckoutSdkContextValue | undefined,
  useCase: string,
): CustomCheckoutSdkContextValue {
  if (!ctx) {
    throw new Error(
      `Could not find CustomCheckoutProvider context; You need to wrap the part of your app that ${useCase} in an <CustomCheckoutProvider> provider.`,
    )
  }

  return ctx
}

export const CustomCheckoutProvider = defineComponent((props: {
  stripe: stripeJs.Stripe | null
  options: stripeJs.StripeCustomCheckoutOptions
}, { slots }) => {
  const customCheckoutSdk = ref<stripeJs.StripeCustomCheckout | null>(null)
  const session = ref<stripeJs.StripeCustomCheckoutSession | null>(null)
  const stripe = toRef(props, 'stripe')

  watchEffect(() => {
    if (stripe.value) {
      stripe.value.initCustomCheckout(props.options).then((value) => {
        if (value) {
          customCheckoutSdk.value = value
          customCheckoutSdk.value.on('change', (value) => {
            session.value = value
          })
        }
      })
    }
  })

  const customCheckoutContextValue = computed(() => extractCustomCheckoutContextValue(customCheckoutSdk.value, session.value))

  provide(CustomCheckoutKey, customCheckoutContextValue)
  provide(CustomCheckoutSdkKey, {
    customCheckoutSdk,
    stripe,
  })

  return () => slots.default?.()
}, {
  inheritAttrs: false,
  props: ['stripe', 'options'],
})

type StripeCustomCheckoutActions = Omit<
  Omit<stripeJs.StripeCustomCheckout, 'session'>,
  'on'
>

export interface CustomCheckoutContextValue
  extends StripeCustomCheckoutActions,
  stripeJs.StripeCustomCheckoutSession {}

function extractCustomCheckoutContextValue(customCheckoutSdk: stripeJs.StripeCustomCheckout | null, sessionState: stripeJs.StripeCustomCheckoutSession | null): CustomCheckoutContextValue | null {
  if (!customCheckoutSdk) {
    return null
  }

  const { on: _on, session: _session, ...actions } = customCheckoutSdk
  if (!sessionState) {
    return { ...actions, ...customCheckoutSdk.session() }
  }

  return { ...actions, ...sessionState }
}

export function useElementsOrCustomCheckoutSdkContextWithUseCase(useCaseString: string) {
  const customCheckoutSdkContext = inject(CustomCheckoutSdkKey, undefined)
  const elementsContext = inject(ElementsKey, undefined)

  if (customCheckoutSdkContext && elementsContext) {
    throw new Error(
      `You cannot wrap the part of your app that ${useCaseString} in both <CustomCheckoutProvider> and <Elements> providers.`,
    )
  }

  if (customCheckoutSdkContext) {
    return parseCustomCheckoutSdkContext(customCheckoutSdkContext, useCaseString)
  }

  return parseElementsContext(elementsContext, useCaseString)
}

export function useCustomCheckoutSdkContextWithUseCase(useCaseString: string): CustomCheckoutSdkContextValue {
  const ctx = inject(CustomCheckoutSdkKey)
  return parseCustomCheckoutSdkContext(ctx, useCaseString)
}

export function useCustomCheckout() {
  useCustomCheckoutSdkContextWithUseCase('calls useCustomCheckout()')
  const ctx = inject(CustomCheckoutSdkKey)
  if (!ctx) {
    throw new Error(
      'Could not find CustomCheckout Context; You need to wrap the part of your app that calls useCustomCheckout() in an <CustomCheckoutProvider> provider.',
    )
  }
  return ctx
}
