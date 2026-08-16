import type * as stripeJs from '@stripe/stripe-js'
import type { InjectionKey, ShallowRef } from 'vue'
import { inject } from 'vue'
import { ElementsContextKey, parseElementsContext } from '../../components/Elements'

type CheckoutSdk = stripeJs.StripeCheckoutElementsSdk | stripeJs.StripeCheckoutFormSdk

export type CheckoutState
  = | { type: 'loading', sdk: CheckoutSdk | null }
    | {
      type: 'success'
      sdkKind: 'elements'
      sdk: stripeJs.StripeCheckoutElementsSdk
      checkoutActions: Extract<stripeJs.StripeCheckoutLoadActionsResult, { type: 'success' }>['actions']
      session: stripeJs.StripeCheckoutSession
    }
    | {
      type: 'success'
      sdkKind: 'form'
      sdk: stripeJs.StripeCheckoutFormSdk
      checkoutActions: Extract<stripeJs.StripeCheckoutFormLoadActionsResult, { type: 'success' }>['actions']
      session: stripeJs.StripeCheckoutSession
    }
    | { type: 'error', error: { message: string } }

export interface CheckoutContextValue {
  stripe: ShallowRef<stripeJs.Stripe | null>
  checkoutState: ShallowRef<CheckoutState>
}

export const CheckoutContextKey = Symbol('Checkout Context') as InjectionKey<CheckoutContextValue>

export function validateCheckoutContext(
  ctx: CheckoutContextValue | null,
  useCase: string,
): CheckoutContextValue {
  if (!ctx) {
    throw new Error(
      `Could not find checkout context; You need to wrap the part of your app that ${useCase} in a <CheckoutElementsProvider> or <CheckoutFormProvider> provider.`,
    )
  }
  return ctx
}

export function useElementsOrCheckoutContextWithUseCase(useCaseString: string) {
  const checkout = inject(CheckoutContextKey, null)
  const elements = inject(ElementsContextKey, null)

  if (checkout) {
    if (elements) {
      throw new Error(
        `You cannot wrap the part of your app that ${useCaseString} in both a checkout provider and <Elements> provider.`,
      )
    }
    return checkout
  }

  return parseElementsContext(elements, useCaseString)
}
