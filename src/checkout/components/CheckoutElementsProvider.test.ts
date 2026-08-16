import type * as stripeJs from '@stripe/stripe-js'
import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { renderComposable } from 'vue-composable-testing'
import * as mocks from '../../../test/mocks'
import { useStripe } from '../../components/useStripe'
import { useCheckoutElements } from './CheckoutContext'
import { CheckoutElementsProvider } from './CheckoutElementsProvider'

describe('checkoutElementsProvider', () => {
  let mockStripe: any
  let mockSdk: any

  beforeEach(() => {
    mockSdk = mocks.mockCheckoutElementsSdk()
    mockStripe = mocks.mockStripe()
    mockStripe.initCheckoutElementsSdk.mockReturnValue(mockSdk)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => vi.restoreAllMocks())

  const options = { clientSecret: 'cs_123' }

  function wrapper(props: Record<string, unknown>) {
    return defineComponent({
      setup(_, { slots }) {
        return () => h(CheckoutElementsProvider, props as any, () => slots.default?.())
      },
    })
  }

  it('initializes the elements sdk exactly once', async () => {
    render(wrapper({ stripe: mockStripe, options }))
    await nextTick()
    expect(mockStripe.initCheckoutElementsSdk).toHaveBeenCalledTimes(1)
    expect(mockStripe.initCheckoutFormSdk).not.toHaveBeenCalled()
  })

  it('exposes the stripe instance through useStripe', async () => {
    const { result } = renderComposable(() => useStripe(), {
      wrapper: wrapper({ stripe: mockStripe, options }),
    })
    await waitFor(() => expect(result.value).toEqual(mockStripe))
  })

  it('resolves to a success state tagged as elements', async () => {
    const { result } = renderComposable(() => useCheckoutElements(), {
      wrapper: wrapper({ stripe: mockStripe, options }),
    })
    await waitFor(() => expect(result.value.type).toBe('success'))
  })

  it('surfaces a loadActions error', async () => {
    mockSdk.loadActions.mockResolvedValue({ type: 'error', error: { message: 'bad secret' } })
    const { result } = renderComposable(() => useCheckoutElements(), {
      wrapper: wrapper({ stripe: mockStripe, options }),
    })
    await waitFor(() => expect(result.value).toEqual({
      type: 'error',
      error: { message: 'bad secret' },
    }))
  })

  it('surfaces a rejected loadActions', async () => {
    mockSdk.loadActions.mockRejectedValue({ message: 'network down' })
    const { result } = renderComposable(() => useCheckoutElements(), {
      wrapper: wrapper({ stripe: mockStripe, options }),
    })
    await waitFor(() => expect(result.value.type).toBe('error'))
  })

  it('refreshes the session from the change event', async () => {
    const { result } = renderComposable(() => useCheckoutElements(), {
      wrapper: wrapper({ stripe: mockStripe, options }),
    })
    await waitFor(() => expect(result.value.type).toBe('success'))

    const handler = mockSdk.on.mock.calls.find((c: any[]) => c[0] === 'change')[1]
    handler({ ...mocks.mockCheckoutSession(), currency: 'eur' })
    await nextTick()
    if (result.value.type !== 'success')
      throw new Error('expected a success state')
    expect(result.value.checkout.currency).toBe('eur')
  })

  it('applies appearance changes from elementsOptions', async () => {
    const opts = ref<stripeJs.StripeCheckoutElementsSdkOptions>({ clientSecret: 'cs_123', elementsOptions: { appearance: { theme: 'stripe' } } })
    render(defineComponent({
      setup: () => () => h(CheckoutElementsProvider, { stripe: mockStripe, options: opts.value }),
    }))
    await waitFor(() => expect(mockSdk.loadActions).toHaveBeenCalled())

    opts.value = { clientSecret: 'cs_123', elementsOptions: { appearance: { theme: 'night' } } }
    await nextTick()
    expect(mockSdk.changeAppearance).toHaveBeenCalledWith({ theme: 'night' })
  })

  it('warns when the stripe prop changes after being set', async () => {
    const stripeProp = ref<any>(mockStripe)
    render(defineComponent({
      setup: () => () => h(CheckoutElementsProvider, { stripe: stripeProp.value, options }),
    }))
    await nextTick()
    stripeProp.value = mocks.mockStripe()
    await nextTick()
    expect(console.warn).toHaveBeenCalledWith(
      'Unsupported prop change on CheckoutElementsProvider: You cannot change the `stripe` prop after setting it.',
    )
  })
})
