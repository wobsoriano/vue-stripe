import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { renderComposable } from 'vue-composable-testing'
import * as mocks from '../../../test/mocks'
import { Elements } from '../../components/Elements'
import { useStripe } from '../../components/useStripe'
import { CheckoutProvider, useCheckout } from './CheckoutProvider'

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

  it('does not call loadFonts a 2nd time if they do not change', async () => {
    const fetchClientSecret = async () => 'cs_123'
    const options = ref({
      fetchClientSecret,
      elementsOptions: {
        fonts: [
          {
            cssSrc: 'https://example.com/font.css',
          },
        ],
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
          fonts: [
            {
              cssSrc: 'https://example.com/font.css',
            },
          ],
        },
      }),
    )

    options.value = {
      fetchClientSecret: async () => 'cs_123',
      elementsOptions: {
        fonts: [
          {
            cssSrc: 'https://example.com/font.css',
          },
        ],
      },
    }

    options.value = {
      fetchClientSecret: async () => 'cs_123',
      elementsOptions: {
        fonts: [
          {
            cssSrc: 'https://example.com/font.css',
          },
        ],
      },
    }

    await waitFor(() => {
      expect(mockStripe.initCheckout).toHaveBeenCalledTimes(1)
      // This is called once, due to the sdk having loaded.
      expect(mockCheckoutSdk.loadFonts).toHaveBeenCalledTimes(1)
    })
  })

  it('allows changes to elementsOptions fonts', async () => {
    const fetchClientSecret = async () => 'cs_123'
    const options = ref({
      fetchClientSecret,
      elementsOptions: {},
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
        elementsOptions: {},
      }),
    )

    options.value = {
      fetchClientSecret: async () => 'cs_123',
      elementsOptions: {
        fonts: [
          {
            cssSrc: 'https://example.com/font.css',
          },
        ],
      },
    }

    await waitFor(() => {
      expect(mockStripe.initCheckout).toHaveBeenCalledTimes(1)
      expect(mockCheckoutSdk.loadFonts).toHaveBeenCalledTimes(1)
      expect(mockCheckoutSdk.loadFonts).toHaveBeenCalledWith([
        {
          cssSrc: 'https://example.com/font.css',
        },
      ])
    })
  })

  it('allows options changes before setting the Stripe object', async () => {
    const fetchClientSecret = async () => 'cs_123'
    const stripe = ref(null)

    const Comp = defineComponent(() => {
      return () => h(CheckoutProvider, {
        stripe: stripe.value,
        options: {
          fetchClientSecret,
          elementsOptions: {
            appearance: { theme: 'stripe' },
          },
        },
      })
    })
    render(Comp)

    await waitFor(() =>
      expect(mockStripe.initCheckout).toHaveBeenCalledTimes(0),
    )

    stripe.value = mockStripe

    await waitFor(() => {
      expect(console.warn).not.toHaveBeenCalled()
      expect(mockStripe.initCheckout).toHaveBeenCalledTimes(1)
      expect(mockStripe.initCheckout).toHaveBeenCalledWith({
        fetchClientSecret,
        elementsOptions: {
          appearance: { theme: 'stripe' },
        },
      })
    })
  })

  it('throws when trying to call useCheckout outside of CheckoutProvider context', () => {
    expect(() => {
      renderComposable(() => useCheckout())
    }).toThrow('Could not find CheckoutProvider context; You need to wrap the part of your app that calls useCheckout() in an <CheckoutProvider> provider.')
  })

  it('throws when trying to call useStripe outside of CheckoutProvider context', () => {
    expect(() => {
      renderComposable(() => useStripe())
    }).toThrow('Could not find Elements context; You need to wrap the part of your app that calls useStripe() in an <Elements> provider.')
  })

  it('throws when trying to call useStripe in Elements -> CheckoutProvider nested context', () => {
    const wrapper = defineComponent({
      setup(_, { slots }) {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CheckoutProvider, { stripe: mockStripe, options: { fetchClientSecret: async () => 'cs_123' } }, () => slots.default?.()))
      },
    })

    expect(() => {
      renderComposable(() => useStripe(), { wrapper })
    }).toThrow('You cannot wrap the part of your app that calls useStripe() in both <CheckoutProvider> and <Elements> providers.')
  })

  it('throws when trying to call useStripe in CheckoutProvider -> Elements nested context', () => {
    const wrapper = defineComponent({
      setup(_, { slots }) {
        return () => h(CheckoutProvider, { stripe: mockStripe, options: { fetchClientSecret: async () => 'cs_123' } }, () => h(Elements, { stripe: mockStripe }, () => slots.default?.()))
      },
    })

    expect(() => {
      renderComposable(() => useStripe(), { wrapper })
    }).toThrow('You cannot wrap the part of your app that calls useStripe() in both <CheckoutProvider> and <Elements> providers.')
  })
})
