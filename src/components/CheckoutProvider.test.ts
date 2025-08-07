import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { renderComposable } from 'vue-composable-testing'
import * as mocks from '../../test/mocks'
import { CheckoutProvider, useCheckout } from './CheckoutProvider'
import { useStripe } from './useStripe'

describe('checkoutProvider', () => {
  let mockStripe: any
  let mockStripePromise: any
  let mockCheckoutSdk: any
  let mockSession: any
  let consoleError: any
  let consoleWarn: any
  let mockCheckout: any

  beforeEach(() => {
    mockStripe = mocks.mockStripe()
    mockStripePromise = Promise.resolve(mockStripe)
    mockCheckoutSdk = mocks.mockCheckoutSdk()
    mockStripe.initCheckout.mockResolvedValue(mockCheckoutSdk)
    mockSession = mocks.mockCheckoutSession()
    mockCheckoutSdk.session.mockReturnValue(mockSession)

    const { on: _on, session: _session, ...actions } = mockCheckoutSdk

    mockCheckout = { ...actions, ...mockSession }

    vi.spyOn(console, 'error')
    vi.spyOn(console, 'warn')
    consoleError = console.error
    consoleWarn = console.warn
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('injects CheckoutProvider with the useCheckout composable', async () => {
    const { result } = renderComposable(() => useCheckout(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(CheckoutProvider, {
            stripe: mockStripe,
            options: { fetchClientSecret: async () => 'cs_123' },
          }, () => slots.default?.())
        },
      }),
    })

    await waitFor(() => expect(result.value).toEqual(mockCheckout))
  })

  it('injects CheckoutProvider with the useStripe composable', async () => {
    const { result } = renderComposable(() => useStripe(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(CheckoutProvider, {
            stripe: mockStripe,
            options: { fetchClientSecret: async () => 'cs_123' },
          }, () => slots.default?.())
        },
      }),
    })

    await waitFor(() => expect(result.value).toEqual(mockStripe))
  })

  it('allows a transition from null to a valid Stripe object', async () => {
    const stripeProp = ref(null)

    const { result } = renderComposable(() => useCheckout(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(CheckoutProvider, {
            stripe: stripeProp.value,
            options: { fetchClientSecret: async () => 'cs_123' },
          }, () => slots.default?.())
        },
      }),
    })

    expect(result.value).toBeNull()

    stripeProp.value = mockStripe

    await waitFor(() => expect(result.value).toEqual(mockCheckout))
  })

  it.todo('works with a Promise resolving to a valid Stripe object', async () => {
    const { result } = renderComposable(() => useCheckout(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(CheckoutProvider, {
            stripe: mockStripePromise,
            options: { fetchClientSecret: async () => 'cs_123' },
          }, () => slots.default?.())
        },
      }),
    })

    await nextTick()

    expect(result.value).toBeNull()
    await nextTick()

    await waitFor(() => expect(result.value).toEqual(mockCheckout))
  })

  it.todo('allows a transition from null to a valid Promise', async () => {
    const stripeProp = ref(null)
    const { result } = renderComposable(() => useCheckout(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(CheckoutProvider, {
            stripe: stripeProp.value,
            options: { fetchClientSecret: async () => 'cs_123' },
          }, () => slots.default?.())
        },
      }),
    })

    expect(result.value).toBeNull()

    stripeProp.value = mockStripePromise
    await nextTick()
    expect(result.value).toBeNull()

    await nextTick()
    await waitFor(() => expect(result.value).toEqual(mockCheckout))
  })

  describe.each([
    ['undefined', undefined],
    ['false', false],
    ['string', 'foo'],
    ['random object', { foo: 'bar' }],
  ])('invalid stripe prop', (name, stripeProp) => {
    it(`errors when props.stripe is ${name}`, () => {
      // Silence console output so test output is less noisy
      consoleError.mockImplementation(() => {})

      const Comp = defineComponent({
        setup() {
          return () => h(CheckoutProvider, {
            stripe: stripeProp as any,
            options: { fetchClientSecret: async () => 'cs_123' },
          }, () => h('div'))
        },
      })

      expect(() =>
        render(Comp),
      ).toThrow('Invalid prop `stripe` supplied to `CheckoutProvider`.')
    })
  })

  it('does not allow changes to an already set Stripe object', async () => {
    const stripe = ref(mockStripe)
    // Silence console output so test output is less noisy
    consoleWarn.mockImplementation(() => {})

    const Comp = defineComponent(() => {
      return () => h(CheckoutProvider, {
        stripe: stripe.value,
        options: { fetchClientSecret: async () => 'cs_123' },
      }, () => h('div'))
    })
    render(Comp)

    const mockStripe2 = mocks.mockStripe()
    stripe.value = mockStripe2

    await waitFor(() => {
      expect(mockStripe.initCheckout).toHaveBeenCalledTimes(1)
      expect(mockStripe2.initCheckout).toHaveBeenCalledTimes(0)
      expect(consoleWarn).toHaveBeenCalledWith(
        'Unsupported prop change on CheckoutProvider: You cannot change the `stripe` prop after setting it.',
      )
    })
  })

  it('initCheckout only called once and allows changes to elementsOptions appearance after setting the Stripe object', async () => {
    // Silence console output so test output is less noisy
    consoleWarn.mockImplementation(() => {})

    const fetchClientSecret = async () => 'cs_123'
    const options = ref({
      fetchClientSecret,
      elementsOptions: {
        appearance: { theme: 'stripe' },
      },
    })
    const Comp = defineComponent(() => {
      return () => h(CheckoutProvider, {
        stripe: mockStripe,
        options: options.value as any,
      })
    })
    render(Comp)

    await waitFor(() =>
      expect(mockStripe.initCheckout).toHaveBeenCalledWith({
        fetchClientSecret,
        elementsOptions: {
          appearance: { theme: 'stripe' },
        },
      }),
    )

    options.value = {
      fetchClientSecret: async () => 'cs_123',
      elementsOptions: {
        appearance: { theme: 'night' },
      },
    }

    await waitFor(() => {
      expect(mockStripe.initCheckout).toHaveBeenCalledTimes(1)
      expect(mockCheckoutSdk.changeAppearance).toHaveBeenCalledTimes(1)
      expect(mockCheckoutSdk.changeAppearance).toHaveBeenCalledWith({
        theme: 'night',
      })
    })
  })
})
