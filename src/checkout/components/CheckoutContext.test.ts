import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, provide, shallowRef } from 'vue'
import { renderComposable } from 'vue-composable-testing'
import * as mocks from '../../../test/mocks'
import { Elements } from '../../components/Elements'
import { useStripe } from '../../components/useStripe'
import {
  CheckoutContextKey,
  useCheckout,
  useCheckoutElements,
  useCheckoutForm,
} from './CheckoutContext'
import { CheckoutElementsProvider } from './CheckoutElementsProvider'

function wrapperFor(state: any) {
  return defineComponent({
    setup(_, { slots }) {
      provide(CheckoutContextKey, {
        stripe: shallowRef(mocks.mockStripe() as any),
        checkoutState: shallowRef(state),
      })
      return () => slots.default?.()
    },
  })
}

function successState(sdkKind: 'elements' | 'form') {
  return {
    type: 'success',
    sdkKind,
    sdk: sdkKind === 'elements' ? mocks.mockCheckoutElementsSdk() : mocks.mockCheckoutFormSdk(),
    checkoutActions: mocks.mockCheckoutActions(),
    session: mocks.mockCheckoutSession(),
  }
}

describe('checkout context', () => {
  it('throws when no provider is present, naming both providers', () => {
    expect(() => renderComposable(() => useCheckout()))
      .toThrow(/<CheckoutElementsProvider> or <CheckoutFormProvider>/)
  })

  it('reports loading before actions resolve', () => {
    const { result } = renderComposable(() => useCheckout(), {
      wrapper: wrapperFor({ type: 'loading', sdk: null }),
    })
    expect(result.value).toEqual({ type: 'loading' })
  })

  it('merges session and actions into the success result', () => {
    const { result } = renderComposable(() => useCheckout(), {
      wrapper: wrapperFor(successState('elements')),
    })
    const value = result.value
    expect(value.type).toBe('success')
    if (value.type !== 'success') {
      throw new Error('expected success')
    }
    expect(value.checkout.currency).toBe('usd')
    expect(typeof value.checkout.confirm).toBe('function')
  })

  it('strips on, loadActions, and getSession from the merged value', () => {
    const { result } = renderComposable(() => useCheckout(), {
      wrapper: wrapperFor(successState('elements')),
    })
    const value = result.value
    if (value.type !== 'success') {
      throw new Error('expected success')
    }
    const checkout = value.checkout as any
    expect(checkout.on).toBeUndefined()
    expect(checkout.loadActions).toBeUndefined()
    expect(checkout.getSession).toBeUndefined()
  })

  it('surfaces the error state', () => {
    const { result } = renderComposable(() => useCheckout(), {
      wrapper: wrapperFor({ type: 'error', error: { message: 'nope' } }),
    })
    expect(result.value).toEqual({ type: 'error', error: { message: 'nope' } })
  })

  it('useCheckoutElements throws under a form provider', () => {
    const Consumer = defineComponent({
      setup() {
        const r = useCheckoutElements()
        return () => h('div', String(r.value.type))
      },
    })
    expect(() => render(wrapperFor(successState('form')), {
      slots: { default: () => h(Consumer) },
    })).toThrow(/must be used inside <CheckoutElementsProvider>/)
  })

  it('useCheckoutForm throws under an elements provider', () => {
    const Consumer = defineComponent({
      setup() {
        const r = useCheckoutForm()
        return () => h('div', String(r.value.type))
      },
    })
    expect(() => render(wrapperFor(successState('elements')), {
      slots: { default: () => h(Consumer) },
    })).toThrow(/must be used inside <CheckoutFormProvider>/)
  })

  it('useCheckout works under both providers', () => {
    for (const kind of ['elements', 'form'] as const) {
      const { result } = renderComposable(() => useCheckout(), {
        wrapper: wrapperFor(successState(kind)),
      })
      expect(result.value.type).toBe('success')
    }
  })

  it('throws when useStripe is called in Elements -> CheckoutElementsProvider nested context', () => {
    const wrapper = defineComponent({
      setup(_, { slots }) {
        return () => h(Elements, {
          stripe: mocks.mockStripe() as any,
        }, () => h(CheckoutElementsProvider, {
          stripe: mocks.mockStripe() as any,
          options: { clientSecret: 'cs_123' },
        }, () => slots.default?.()))
      },
    })

    expect(() => {
      renderComposable(() => useStripe(), { wrapper })
    }).toThrow('You cannot wrap the part of your app that calls useStripe() in both a checkout provider and <Elements> provider.')
  })

  it('throws when useStripe is called in CheckoutElementsProvider -> Elements nested context', () => {
    const wrapper = defineComponent({
      setup(_, { slots }) {
        return () => h(CheckoutElementsProvider, {
          stripe: mocks.mockStripe() as any,
          options: { clientSecret: 'cs_123' },
        }, () => h(Elements, {
          stripe: mocks.mockStripe() as any,
        }, () => slots.default?.()))
      },
    })

    expect(() => {
      renderComposable(() => useStripe(), { wrapper })
    }).toThrow('You cannot wrap the part of your app that calls useStripe() in both a checkout provider and <Elements> provider.')
  })
})
