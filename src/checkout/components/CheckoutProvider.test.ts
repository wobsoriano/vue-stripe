import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { renderComposable } from 'vue-composable-testing'
import makeDeferred from '../../../test/makeDeferred'
import * as mocks from '../../../test/mocks'
import { Elements } from '../../components/Elements'
import { useStripe } from '../../components/useStripe'
import { CheckoutProvider, useCheckout } from './CheckoutProvider'

describe('checkout provider', () => {
  let mockStripe: any
  let mockStripePromise: any
  let mockCheckoutSdk: any
  let consoleError: any
  let consoleWarn: any
  let mockCheckoutActions: any

  beforeEach(() => {
    mockCheckoutSdk = mocks.mockCheckoutSdk()
    mockCheckoutActions = mocks.mockCheckoutActions()
    mockCheckoutSdk.loadActions.mockResolvedValue({
      type: 'success',
      actions: mockCheckoutActions,
    })

    mockStripe = mocks.mockStripe()
    mockStripe.initCheckout.mockReturnValue(mockCheckoutSdk)
    mockStripePromise = Promise.resolve(mockStripe)

    vi.spyOn(console, 'error')
    vi.spyOn(console, 'warn')
    consoleError = console.error
    consoleWarn = console.warn
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const fakeClientSecret = 'cs_123'

  describe('interaction with useStripe()', () => {
    it('works with a Stripe instance', async () => {
      const { result } = renderComposable(() => useStripe(), {
        wrapper: defineComponent({
          setup(_, { slots }) {
            return () => h(CheckoutProvider, {
              stripe: mockStripe,
              options: {
                clientSecret: fakeClientSecret,
              },
            }, () => slots.default?.())
          },
        }),
      })

      await waitFor(() => expect(result.value).toEqual(mockStripe))
    })

    it('works when updating null to a Stripe instance', async () => {
      const stripe = ref(null)

      const { result } = renderComposable(() => useStripe(), {
        wrapper: defineComponent({
          setup(_, { slots }) {
            return () => h(CheckoutProvider, {
              stripe: stripe.value,
              options: {
                clientSecret: fakeClientSecret,
              },
            }, () => slots.default?.())
          },
        }),
      })

      expect(result.value).toBe(null)

      stripe.value = mockStripe

      await waitFor(() => expect(result.value).toEqual(mockStripe))
    })

    it('works with a Promise', async () => {
      const deferred = makeDeferred()
      const stripe = ref(deferred.promise)

      const { result } = renderComposable(() => useStripe(), {
        wrapper: defineComponent({
          setup(_, { slots }) {
            return () => h(CheckoutProvider, {
              stripe: stripe.value as any,
              options: {
                clientSecret: fakeClientSecret,
              },
            }, () => slots.default?.())
          },
        }),
      })

      expect(result.value).toBe(null)

      await deferred.resolve(mockStripe)

      await waitFor(() => expect(result.value).toEqual(mockStripe))
    })
  })

  describe('interaction with useCheckout()', () => {
    it('works when loadActions resolves', async () => {
      const stripe: any = mocks.mockStripe()
      const deferred = makeDeferred()
      const mockSdk = mocks.mockCheckoutSdk()
      const testMockCheckoutActions = mocks.mockCheckoutActions()
      const testMockSession = mocks.mockCheckoutSession()

      mockSdk.loadActions.mockReturnValue(deferred.promise)
      stripe.initCheckout.mockReturnValue(mockSdk)

      const { result } = renderComposable(() => useCheckout(), {
        wrapper: defineComponent({
          setup(_, { slots }) {
            return () => h(CheckoutProvider, {
              stripe,
              options: {
                clientSecret: fakeClientSecret,
              },
            }, () => slots.default?.())
          },
        }),
      })

      expect(result.value).toEqual({ type: 'loading' })
      expect(stripe.initCheckout).toHaveBeenCalledTimes(1)

      deferred.resolve({
        type: 'success',
        actions: testMockCheckoutActions,
      })

      await nextTick()

      const { on: _on, loadActions: _loadActions, ...elementsMethods } = mockSdk
      const {
        getSession: _getSession,
        ...otherCheckoutActions
      } = testMockCheckoutActions

      const expectedCheckout = {
        ...elementsMethods,
        ...otherCheckoutActions,
        ...testMockSession,
      }

      expect(result.value).toEqual({
        type: 'success',
        checkout: expectedCheckout,
      })
      expect(stripe.initCheckout).toHaveBeenCalledTimes(1)
    })

    it('works when loadActions rejects', async () => {
      const stripe: any = mocks.mockStripe()
      const deferred = makeDeferred()
      const mockSdk = mocks.mockCheckoutSdk()
      mockSdk.loadActions.mockReturnValue(deferred.promise)
      stripe.initCheckout.mockReturnValue(mockSdk)

      const { result } = renderComposable(() => useCheckout(), {
        wrapper: defineComponent({
          setup(_, { slots }) {
            return () => h(CheckoutProvider, {
              stripe,
              options: {
                clientSecret: fakeClientSecret,
              },
            }, () => slots.default?.())
          },
        }),
      })

      expect(result.value).toEqual({ type: 'loading' })
      expect(stripe.initCheckout).toHaveBeenCalledTimes(1)

      deferred.reject(new Error('initCheckout error'))

      await nextTick()
      await nextTick()

      expect(result.value).toEqual({
        type: 'error',
        error: new Error('initCheckout error'),
      })
      expect(stripe.initCheckout).toHaveBeenCalledTimes(1)
    })

    it('does not set context if Promise resolves after CheckoutProvider is unmounted', async () => {
      const Component = defineComponent({
        setup() {
          return () => h(CheckoutProvider, {
            stripe: mockStripePromise,
            options: {
              clientSecret: Promise.resolve(fakeClientSecret),
            },
          })
        },
      })

      const { unmount } = render(Component)

      unmount()

      await mockStripePromise
      await nextTick()

      expect(consoleError).not.toHaveBeenCalled()
    })
  })

  describe('stripe prop', () => {
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
              options: { clientSecret: fakeClientSecret },
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
          options: { clientSecret: fakeClientSecret },
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
      const options = ref({
        clientSecret: fakeClientSecret,
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
          clientSecret: fakeClientSecret,
          elementsOptions: {
            appearance: { theme: 'stripe' },
          },
        }),
      )

      options.value = {
        clientSecret: fakeClientSecret,
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
      const options = ref({
        clientSecret: fakeClientSecret,
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
          clientSecret: fakeClientSecret,
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
        clientSecret: fakeClientSecret,
        elementsOptions: {
          fonts: [
            {
              cssSrc: 'https://example.com/font.css',
            },
          ],
        },
      }

      options.value = {
        clientSecret: fakeClientSecret,
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
      const options = ref({
        clientSecret: fakeClientSecret,
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
          clientSecret: fakeClientSecret,
          elementsOptions: {},
        }),
      )

      options.value = {
        clientSecret: fakeClientSecret,
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
      const stripe = ref(null)

      const Comp = defineComponent(() => {
        return () => h(CheckoutProvider, {
          stripe: stripe.value,
          options: {
            clientSecret: fakeClientSecret,
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
          clientSecret: fakeClientSecret,
          elementsOptions: {
            appearance: { theme: 'stripe' },
          },
        })
      })
    })

    it('throws when trying to call useCheckout outside of CheckoutProvider context', () => {
      expect(() => {
        renderComposable(() => useCheckout())
      }).toThrow('Could not find CheckoutProvider context; You need to wrap the part of your app that calls useCheckout() in a <CheckoutProvider> provider.')
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
          }, () => h(CheckoutProvider, { stripe: mockStripe, options: { clientSecret: fakeClientSecret } }, () => slots.default?.()))
        },
      })

      expect(() => {
        renderComposable(() => useStripe(), { wrapper })
      }).toThrow('You cannot wrap the part of your app that calls useStripe() in both <CheckoutProvider> and <Elements> providers.')
    })

    it('throws when trying to call useStripe in CheckoutProvider -> Elements nested context', () => {
      const wrapper = defineComponent({
        setup(_, { slots }) {
          return () => h(CheckoutProvider, { stripe: mockStripe, options: { clientSecret: fakeClientSecret } }, () => h(Elements, { stripe: mockStripe }, () => slots.default?.()))
        },
      })

      expect(() => {
        renderComposable(() => useStripe(), { wrapper })
      }).toThrow('You cannot wrap the part of your app that calls useStripe() in both <CheckoutProvider> and <Elements> providers.')
    })
  })
})
