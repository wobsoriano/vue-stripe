import type * as stripeJs from '@stripe/stripe-js'
import type { ComputedRef, InjectionKey, ShallowRef } from 'vue'
import { computed, inject } from 'vue'
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

type ElementsLoadActionsSuccess = Extract<stripeJs.StripeCheckoutLoadActionsResult, { type: 'success' }>['actions']
type FormLoadActionsSuccess = Extract<stripeJs.StripeCheckoutFormLoadActionsResult, { type: 'success' }>['actions']

type StripeCheckoutElementsActions
  = Omit<stripeJs.StripeCheckoutElementsSdk, 'on' | 'loadActions'>
    & Omit<ElementsLoadActionsSuccess, 'getSession'>

type StripeCheckoutFormActions
  = Omit<stripeJs.StripeCheckoutFormSdk, 'on' | 'loadActions'>
    & Omit<FormLoadActionsSuccess, 'getSession'>

export type StripeCheckoutElementsValue = StripeCheckoutElementsActions & stripeJs.StripeCheckoutSession
export type StripeCheckoutFormValue = StripeCheckoutFormActions & stripeJs.StripeCheckoutSession

/**
 * Back-compat alias. Existing consumers see the Elements shape, unchanged.
 */
export type StripeCheckoutValue = StripeCheckoutElementsValue

export type StripeUseCheckoutElementsResult
  = | { type: 'loading' }
    | { type: 'success', checkout: StripeCheckoutElementsValue }
    | { type: 'error', error: { message: string } }

export type StripeUseCheckoutFormResult
  = | { type: 'loading' }
    | { type: 'success', checkout: StripeCheckoutFormValue }
    | { type: 'error', error: { message: string } }

export type StripeUseCheckoutResult = StripeUseCheckoutElementsResult

function mapStateToCheckoutResult<T extends StripeCheckoutElementsValue | StripeCheckoutFormValue>(
  checkoutState: CheckoutState,
): { type: 'loading' } | { type: 'success', checkout: T } | { type: 'error', error: { message: string } } {
  if (checkoutState.type === 'success') {
    const { sdk, session, checkoutActions } = checkoutState
    const { on: _on, loadActions: _loadActions, ...sdkMethods } = sdk
    const { getSession: _getSession, ...otherCheckoutActions } = checkoutActions
    return {
      type: 'success',
      checkout: {
        ...session,
        ...sdkMethods,
        ...otherCheckoutActions,
      } as unknown as T,
    }
  }

  if (checkoutState.type === 'loading') {
    return { type: 'loading' }
  }

  return { type: 'error', error: checkoutState.error }
}

/**
 * @deprecated Since v3.0.0. Prefer the provider-specific composables.
 * Inside `<CheckoutElementsProvider>` use `useCheckoutElements()`.
 * Inside `<CheckoutFormProvider>` use `useCheckoutForm()`.
 *
 * This keeps working under both providers and returns the Elements-shaped
 * result for backward compatibility.
 */
export function useCheckout(): ComputedRef<StripeUseCheckoutResult> {
  const ctx = inject(CheckoutContextKey, null)
  const { checkoutState } = validateCheckoutContext(ctx, 'calls useCheckout()')
  return computed(() => mapStateToCheckoutResult<StripeCheckoutElementsValue>(checkoutState.value))
}

export function useCheckoutElements(): ComputedRef<StripeUseCheckoutElementsResult> {
  const ctx = inject(CheckoutContextKey, null)
  const { checkoutState } = validateCheckoutContext(ctx, 'calls useCheckoutElements()')
  return computed(() => {
    const state = checkoutState.value
    if (state.type === 'success' && state.sdkKind !== 'elements') {
      throw new Error(
        'useCheckoutElements() must be used inside <CheckoutElementsProvider>. Inside <CheckoutFormProvider>, use useCheckoutForm() instead.',
      )
    }
    return mapStateToCheckoutResult<StripeCheckoutElementsValue>(state)
  })
}

export function useCheckoutForm(): ComputedRef<StripeUseCheckoutFormResult> {
  const ctx = inject(CheckoutContextKey, null)
  const { checkoutState } = validateCheckoutContext(ctx, 'calls useCheckoutForm()')
  return computed(() => {
    const state = checkoutState.value
    if (state.type === 'success' && state.sdkKind !== 'form') {
      throw new Error(
        'useCheckoutForm() must be used inside <CheckoutFormProvider>. Inside <CheckoutElementsProvider>, use useCheckoutElements() instead.',
      )
    }
    return mapStateToCheckoutResult<StripeCheckoutFormValue>(state)
  })
}
