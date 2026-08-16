import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { renderComposable } from 'vue-composable-testing'
import * as mocks from '../../../test/mocks'
import { useCheckoutForm } from './CheckoutContext'
import { CheckoutFormProvider } from './CheckoutFormProvider'

describe('checkoutFormProvider', () => {
  let mockStripe: any
  let mockSdk: any

  beforeEach(() => {
    mockSdk = mocks.mockCheckoutFormSdk()
    mockStripe = mocks.mockStripe()
    mockStripe.initCheckoutFormSdk.mockReturnValue(mockSdk)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => vi.restoreAllMocks())

  const options = { clientSecret: 'cs_123' }

  function wrapper(props: Record<string, unknown>) {
    return defineComponent({
      setup(_, { slots }) {
        return () => h(CheckoutFormProvider, props as any, () => slots.default?.())
      },
    })
  }

  it('initializes the form sdk exactly once', async () => {
    render(wrapper({ stripe: mockStripe, options }))
    await nextTick()
    expect(mockStripe.initCheckoutFormSdk).toHaveBeenCalledTimes(1)
    expect(mockStripe.initCheckoutElementsSdk).not.toHaveBeenCalled()
  })

  it('resolves to a success state tagged as form', async () => {
    const { result } = renderComposable(() => useCheckoutForm(), {
      wrapper: wrapper({ stripe: mockStripe, options }),
    })
    await waitFor(() => expect(result.value.type).toBe('success'))
  })

  it('reads appearance from the top level, not elementsOptions', async () => {
    const opts = ref<any>({ clientSecret: 'cs_123', appearance: { theme: 'stripe' } })
    render(defineComponent({
      setup: () => () => h(CheckoutFormProvider, { stripe: mockStripe, options: opts.value }),
    }))
    await waitFor(() => expect(mockSdk.loadActions).toHaveBeenCalled())

    opts.value = { clientSecret: 'cs_123', appearance: { theme: 'night' } }
    await nextTick()
    expect(mockSdk.changeAppearance).toHaveBeenCalledWith({ theme: 'night' })
  })

  it('reads fonts from the top level', async () => {
    const opts = ref<any>({ clientSecret: 'cs_123', fonts: [] })
    render(defineComponent({
      setup: () => () => h(CheckoutFormProvider, { stripe: mockStripe, options: opts.value }),
    }))
    await waitFor(() => expect(mockSdk.loadActions).toHaveBeenCalled())

    opts.value = { clientSecret: 'cs_123', fonts: [{ cssSrc: 'https://example.com/f.css' }] }
    await nextTick()
    expect(mockSdk.loadFonts).toHaveBeenCalledWith([{ cssSrc: 'https://example.com/f.css' }])
  })

  it('surfaces a loadActions error', async () => {
    mockSdk.loadActions.mockResolvedValue({ type: 'error', error: { message: 'bad secret' } })
    const { result } = renderComposable(() => useCheckoutForm(), {
      wrapper: wrapper({ stripe: mockStripe, options }),
    })
    await waitFor(() => expect(result.value.type).toBe('error'))
  })

  it('warns when the stripe prop changes after being set', async () => {
    const stripeProp = ref<any>(mockStripe)
    render(defineComponent({
      setup: () => () => h(CheckoutFormProvider, { stripe: stripeProp.value, options }),
    }))
    await nextTick()
    stripeProp.value = mocks.mockStripe()
    await nextTick()
    expect(console.warn).toHaveBeenCalledWith(
      'Unsupported prop change on CheckoutFormProvider: You cannot change the `stripe` prop after setting it.',
    )
  })
})
