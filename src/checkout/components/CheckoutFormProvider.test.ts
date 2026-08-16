import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { renderComposable } from 'vue-composable-testing'
import makeDeferred from '../../../test/makeDeferred'
import * as mocks from '../../../test/mocks'
import { useStripe } from '../../components/useStripe'
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

  it('does not re-initialize the sdk when the stripe prop transitions through the parsed watcher again', async () => {
    const stripeProp = ref<any>(null)
    render(defineComponent({
      setup: () => () => h(CheckoutFormProvider, { stripe: stripeProp.value, options }),
    }))
    await nextTick()
    expect(mockStripe.initCheckoutFormSdk).not.toHaveBeenCalled()

    // null -> stripe: the parsed watcher's tag goes 'empty' -> 'sync', so it
    // fires and initializes the sdk.
    stripeProp.value = mockStripe
    await nextTick()
    expect(mockStripe.initCheckoutFormSdk).toHaveBeenCalledTimes(1)

    // stripe -> null -> stripe: two more genuine value changes, so the
    // parsed watcher fires twice more. The `initCalled` guard (module-level
    // for the component instance, not reset per watcher run) must still
    // prevent a second initCheckoutFormSdk call.
    stripeProp.value = null
    await nextTick()
    stripeProp.value = mockStripe
    await nextTick()

    expect(mockStripe.initCheckoutFormSdk).toHaveBeenCalledTimes(1)
  })

  it('works with a Promise', async () => {
    const deferred = makeDeferred()
    const stripePromise = ref(deferred.promise)

    const { result } = renderComposable(() => useStripe(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(CheckoutFormProvider, {
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

  it('does not set context if the stripe Promise resolves after CheckoutFormProvider is unmounted', async () => {
    const stripePromise = Promise.resolve(mockStripe)

    const Component = defineComponent({
      setup() {
        return () => h(CheckoutFormProvider, {
          stripe: stripePromise as any,
          options,
        })
      },
    })

    const { unmount } = render(Component)

    unmount()

    // parseStripeProp wraps the raw promise in an extra `Promise.resolve(raw).then(validate)`
    // hop before the provider's own `.then` runs, so a single `await stripePromise; await
    // nextTick()` returns before the provider ever reaches its cancellation check. Wait out
    // several microtask/macrotask turns so we actually reach the code under test.
    await stripePromise
    await nextTick()
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockStripe.initCheckoutFormSdk).not.toHaveBeenCalled()
    expect(mockStripe._registerWrapper).not.toHaveBeenCalled()
  })

  it('resolves to a success state tagged as form', async () => {
    const { result } = renderComposable(() => useCheckoutForm(), {
      wrapper: wrapper({ stripe: mockStripe, options }),
    })
    await waitFor(() => expect(result.value.type).toBe('success'))
  })

  it('surfaces a loadActions error', async () => {
    mockSdk.loadActions.mockResolvedValue({ type: 'error', error: { message: 'bad secret' } })
    const { result } = renderComposable(() => useCheckoutForm(), {
      wrapper: wrapper({ stripe: mockStripe, options }),
    })
    await waitFor(() => expect(result.value.type).toBe('error'))
  })

  it('surfaces a rejected loadActions', async () => {
    mockSdk.loadActions.mockRejectedValue({ message: 'network down' })
    const { result } = renderComposable(() => useCheckoutForm(), {
      wrapper: wrapper({ stripe: mockStripe, options }),
    })
    await waitFor(() => expect(result.value.type).toBe('error'))
  })

  it('refreshes the session from the change event', async () => {
    const { result } = renderComposable(() => useCheckoutForm(), {
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

  it('does not call changeAppearance a 2nd time if it does not change', async () => {
    const opts = ref<any>({
      clientSecret: 'cs_123',
      appearance: { theme: 'stripe' },
    })
    const Comp = defineComponent(() => {
      return () => h(CheckoutFormProvider, {
        stripe: mockStripe,
        options: opts.value,
      })
    })
    render(Comp)

    await waitFor(() =>
      expect(mockStripe.initCheckoutFormSdk).toHaveBeenCalledWith({
        clientSecret: 'cs_123',
        appearance: { theme: 'stripe' },
      }),
    )

    opts.value = {
      clientSecret: 'cs_123',
      appearance: { theme: 'stripe' },
    }

    opts.value = {
      clientSecret: 'cs_123',
      appearance: { theme: 'stripe' },
    }

    // Two ticks so the deep watcher on options.appearance has a chance to
    // actually flush before we assert. Without these, waitFor's first
    // attempt runs before Vue flushes the watcher, so the spy would still
    // read 0 calls and the assertion below would pass vacuously even if
    // changeAppearance were wrongly called.
    await nextTick()
    await nextTick()

    await waitFor(() => {
      expect(mockStripe.initCheckoutFormSdk).toHaveBeenCalledTimes(1)
      // This is not called because the appearance value did not change.
      expect(mockSdk.changeAppearance).toHaveBeenCalledTimes(0)
    })
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

  it('does not call loadFonts a 2nd time if they do not change', async () => {
    const opts = ref<any>({
      clientSecret: 'cs_123',
      fonts: [{ cssSrc: 'https://example.com/font.css' }],
    })
    const Comp = defineComponent(() => {
      return () => h(CheckoutFormProvider, {
        stripe: mockStripe,
        options: opts.value,
      })
    })
    render(Comp)

    await waitFor(() =>
      expect(mockStripe.initCheckoutFormSdk).toHaveBeenCalledWith({
        clientSecret: 'cs_123',
        fonts: [{ cssSrc: 'https://example.com/font.css' }],
      }),
    )

    opts.value = {
      clientSecret: 'cs_123',
      fonts: [{ cssSrc: 'https://example.com/font.css' }],
    }

    opts.value = {
      clientSecret: 'cs_123',
      fonts: [{ cssSrc: 'https://example.com/font.css' }],
    }

    // Two ticks so the deep watcher on options.fonts has a chance to
    // actually flush before we assert. Without these, waitFor's first
    // attempt runs before Vue flushes the watcher, so the spy would still
    // read 0 calls and the assertion below would pass vacuously even if
    // loadFonts were wrongly called.
    await nextTick()
    await nextTick()

    await waitFor(() => {
      expect(mockStripe.initCheckoutFormSdk).toHaveBeenCalledTimes(1)
      // This is not called because the fonts value did not change.
      expect(mockSdk.loadFonts).toHaveBeenCalledTimes(0)
    })
  })

  it('reacts to nested appearance mutations', async () => {
    const opts = ref<any>({
      clientSecret: 'cs_123',
      appearance: { theme: 'stripe' },
    })
    const Comp = defineComponent(() => {
      return () => h(CheckoutFormProvider, {
        stripe: mockStripe,
        options: opts.value,
      })
    })

    render(Comp)

    await waitFor(() => expect(mockStripe.initCheckoutFormSdk).toHaveBeenCalledTimes(1))

    mockSdk.changeAppearance.mockClear()
    opts.value.appearance.theme = 'night'

    // Two ticks so the deep watcher on options.appearance has a chance to
    // actually flush before we assert. Without these, a single nextTick
    // (or a waitFor that resolves on its first attempt) could pass
    // vacuously even if the deep watcher were wrongly dropped.
    await nextTick()
    await nextTick()

    expect(mockSdk.changeAppearance).toHaveBeenCalledWith({ theme: 'night' })
  })

  it('reacts to nested font mutations', async () => {
    const opts = ref<any>({
      clientSecret: 'cs_123',
      fonts: [{ cssSrc: 'https://example.com/font.css' }],
    })
    const Comp = defineComponent(() => {
      return () => h(CheckoutFormProvider, {
        stripe: mockStripe,
        options: opts.value,
      })
    })

    render(Comp)

    await waitFor(() => expect(mockStripe.initCheckoutFormSdk).toHaveBeenCalledTimes(1))

    mockSdk.loadFonts.mockClear()
    opts.value.fonts[0].cssSrc = 'https://example.com/font-2.css'

    // Two ticks so the deep watcher on options.fonts has a chance to
    // actually flush before we assert. Without these, a single nextTick
    // (or a waitFor that resolves on its first attempt) could pass
    // vacuously even if the deep watcher were wrongly dropped.
    await nextTick()
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
            return () => h(CheckoutFormProvider, {
              stripe: stripeProp as any,
              options,
            }, () => h('div'))
          },
        })

        expect(() =>
          render(Comp),
        ).toThrow('Invalid prop `stripe` supplied to `CheckoutFormProvider`.')
      })
    })
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
