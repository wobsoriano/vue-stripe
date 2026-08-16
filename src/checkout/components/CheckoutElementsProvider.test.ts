import type * as stripeJs from '@stripe/stripe-js'
import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { renderComposable } from 'vue-composable-testing'
import makeDeferred from '../../../test/makeDeferred'
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

  it('works with a Promise', async () => {
    const deferred = makeDeferred()
    const stripePromise = ref(deferred.promise)

    const { result } = renderComposable(() => useStripe(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(CheckoutElementsProvider, {
            stripe: stripePromise.value as any,
            options,
          }, () => slots.default?.())
        },
      }),
    })

    expect(result.value).toBe(null)

    await deferred.resolve(mockStripe)

    await waitFor(() => expect(result.value).toEqual(mockStripe))
  })

  it('does not set context if the stripe Promise resolves after CheckoutElementsProvider is unmounted', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const stripePromise = Promise.resolve(mockStripe)

    const Component = defineComponent({
      setup() {
        return () => h(CheckoutElementsProvider, {
          stripe: stripePromise as any,
          options,
        })
      },
    })

    const { unmount } = render(Component)

    unmount()

    await stripePromise
    await nextTick()

    expect(consoleError).not.toHaveBeenCalled()
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
    expect(mockStripe.initCheckoutElementsSdk).toHaveBeenCalledWith({
      clientSecret: 'cs_123',
      elementsOptions: { appearance: { theme: 'stripe' } },
    })

    opts.value = { clientSecret: 'cs_123', elementsOptions: { appearance: { theme: 'night' } } }
    await nextTick()
    expect(mockSdk.changeAppearance).toHaveBeenCalledWith({ theme: 'night' })
    expect(mockStripe.initCheckoutElementsSdk).toHaveBeenCalledTimes(1)
  })

  it('does not call loadFonts a 2nd time if they do not change', async () => {
    const opts = ref<stripeJs.StripeCheckoutElementsSdkOptions>({
      clientSecret: 'cs_123',
      elementsOptions: {
        fonts: [{ cssSrc: 'https://example.com/font.css' }],
      },
    })
    const Comp = defineComponent(() => {
      return () => h(CheckoutElementsProvider, {
        stripe: mockStripe,
        options: opts.value,
      })
    })
    render(Comp)

    await waitFor(() =>
      expect(mockStripe.initCheckoutElementsSdk).toHaveBeenCalledWith({
        clientSecret: 'cs_123',
        elementsOptions: {
          fonts: [{ cssSrc: 'https://example.com/font.css' }],
        },
      }),
    )

    opts.value = {
      clientSecret: 'cs_123',
      elementsOptions: {
        fonts: [{ cssSrc: 'https://example.com/font.css' }],
      },
    }

    opts.value = {
      clientSecret: 'cs_123',
      elementsOptions: {
        fonts: [{ cssSrc: 'https://example.com/font.css' }],
      },
    }

    await waitFor(() => {
      expect(mockStripe.initCheckoutElementsSdk).toHaveBeenCalledTimes(1)
      // This is not called because the fonts value did not change.
      expect(mockSdk.loadFonts).toHaveBeenCalledTimes(0)
    })
  })

  it('allows changes to elementsOptions fonts', async () => {
    const opts = ref<stripeJs.StripeCheckoutElementsSdkOptions>({
      clientSecret: 'cs_123',
      elementsOptions: {},
    })
    const Comp = defineComponent(() => {
      return () => h(CheckoutElementsProvider, {
        stripe: mockStripe,
        options: opts.value,
      })
    })
    render(Comp)

    await waitFor(() =>
      expect(mockStripe.initCheckoutElementsSdk).toHaveBeenCalledWith({
        clientSecret: 'cs_123',
        elementsOptions: {},
      }),
    )

    opts.value = {
      clientSecret: 'cs_123',
      elementsOptions: {
        fonts: [{ cssSrc: 'https://example.com/font.css' }],
      },
    }

    await waitFor(() => {
      expect(mockStripe.initCheckoutElementsSdk).toHaveBeenCalledTimes(1)
      expect(mockSdk.loadFonts).toHaveBeenCalledTimes(1)
      expect(mockSdk.loadFonts).toHaveBeenCalledWith([
        { cssSrc: 'https://example.com/font.css' },
      ])
    })
  })

  it('reacts to nested font mutations', async () => {
    const opts = ref<any>({
      clientSecret: 'cs_123',
      elementsOptions: {
        fonts: [{ cssSrc: 'https://example.com/font.css' }],
      },
    })
    const Comp = defineComponent(() => {
      return () => h(CheckoutElementsProvider, {
        stripe: mockStripe,
        options: opts.value,
      })
    })

    render(Comp)

    await waitFor(() => expect(mockStripe.initCheckoutElementsSdk).toHaveBeenCalledTimes(1))

    mockSdk.loadFonts.mockClear()
    opts.value.elementsOptions.fonts[0].cssSrc = 'https://example.com/font-2.css'
    await nextTick()

    expect(mockSdk.loadFonts).toHaveBeenCalledWith([
      { cssSrc: 'https://example.com/font-2.css' },
    ])
  })

  describe('stripe prop', () => {
    describe.each([
      ['undefined', undefined],
      ['false', false],
      ['string', 'foo'],
      ['random object', { foo: 'bar' }],
    ])('invalid stripe prop', (name, stripeProp) => {
      it(`errors when props.stripe is ${name}`, () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})

        const Comp = defineComponent({
          setup() {
            return () => h(CheckoutElementsProvider, {
              stripe: stripeProp as any,
              options,
            }, () => h('div'))
          },
        })

        expect(() =>
          render(Comp),
        ).toThrow('Invalid prop `stripe` supplied to `CheckoutElementsProvider`.')
      })
    })
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
