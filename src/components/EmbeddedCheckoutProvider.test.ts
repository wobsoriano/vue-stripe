import { render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import * as mocks from '../../test/mocks'
import {
  EmbeddedCheckoutProvider,
  useEmbeddedCheckoutContext,
} from './EmbeddedCheckoutProvider'

function makeWrapper(stripe: any, options: any) {
  return defineComponent(() => {
    return () => h(EmbeddedCheckoutProvider, { stripe, options })
  })
}

describe('embeddedCheckoutProvider', () => {
  let mockStripe: any
  let mockStripePromise: any
  let mockEmbeddedCheckout: any
  let mockEmbeddedCheckoutPromise: any
  const fakeClientSecret = 'cs_123_secret_abc'
  const fetchClientSecret = () => Promise.resolve(fakeClientSecret)
  const fakeOptions = { fetchClientSecret }

  beforeEach(() => {
    mockStripe = mocks.mockStripe()
    mockStripePromise = Promise.resolve(mockStripe)
    mockEmbeddedCheckout = mocks.mockEmbeddedCheckout()
    mockEmbeddedCheckoutPromise = Promise.resolve(mockEmbeddedCheckout)
    mockStripe.initEmbeddedCheckout.mockReturnValue(mockEmbeddedCheckoutPromise)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('context', () => {
    it('provides the Embedded Checkout instance via context', async () => {
      let ctx: any
      const Consumer = defineComponent(() => {
        ctx = useEmbeddedCheckoutContext()
        return () => null
      })
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, { stripe: mockStripe, options: fakeOptions }, () => h(Consumer))
      })

      render(Comp)
      await mockEmbeddedCheckoutPromise

      expect(ctx.embeddedCheckout.value).toBe(mockEmbeddedCheckout)
    })

    it('only initializes embedded checkout once', async () => {
      const stripe = ref(mockStripe)
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, { stripe: stripe.value, options: fakeOptions })
      })

      render(Comp)
      await mockEmbeddedCheckoutPromise

      stripe.value = mockStripe
      await nextTick()

      expect(mockStripe.initEmbeddedCheckout).toHaveBeenCalledTimes(1)
    })

    it('throws when useEmbeddedCheckoutContext is used outside provider', () => {
      const Consumer = defineComponent(() => {
        useEmbeddedCheckoutContext()
        return () => null
      })

      expect(() => render(Consumer)).toThrow(
        '<EmbeddedCheckout> must be used within <EmbeddedCheckoutProvider>',
      )
    })
  })

  describe('stripe prop', () => {
    it('works with a synchronous Stripe object', async () => {
      let ctx: any
      const Consumer = defineComponent(() => {
        ctx = useEmbeddedCheckoutContext()
        return () => null
      })
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, { stripe: mockStripe, options: fakeOptions }, () => h(Consumer))
      })

      render(Comp)
      await mockEmbeddedCheckoutPromise

      expect(ctx.embeddedCheckout.value).toBe(mockEmbeddedCheckout)
    })

    it('works with a Promise resolving to a valid Stripe object', async () => {
      let ctx: any
      const Consumer = defineComponent(() => {
        ctx = useEmbeddedCheckoutContext()
        return () => null
      })
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, { stripe: mockStripePromise, options: fakeOptions }, () => h(Consumer))
      })

      render(Comp)
      expect(ctx.embeddedCheckout.value).toBeNull()

      await nextTick()
      await nextTick()
      await nextTick()

      expect(ctx.embeddedCheckout.value).toBe(mockEmbeddedCheckout)
    })

    it('allows a transition from null to a valid Stripe object', async () => {
      let ctx: any
      const stripe = ref<any>(null)
      const Consumer = defineComponent(() => {
        ctx = useEmbeddedCheckoutContext()
        return () => null
      })
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, { stripe: stripe.value, options: fakeOptions }, () => h(Consumer))
      })

      render(Comp)
      expect(ctx.embeddedCheckout.value).toBeNull()

      stripe.value = mockStripe
      await nextTick()
      await mockEmbeddedCheckoutPromise

      expect(ctx.embeddedCheckout.value).toBe(mockEmbeddedCheckout)
    })

    it('works with a Promise resolving to null (SSR safety)', async () => {
      const nullPromise = Promise.resolve(null)
      let ctx: any
      const Consumer = defineComponent(() => {
        ctx = useEmbeddedCheckoutContext()
        return () => null
      })
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, { stripe: nullPromise, options: fakeOptions }, () => h(Consumer))
      })

      render(Comp)
      await nullPromise

      expect(ctx.embeddedCheckout.value).toBeNull()
      expect(mockStripe.initEmbeddedCheckout).not.toHaveBeenCalled()
    })

    it('warns when the stripe prop changes after being set', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const stripe = ref<any>(mockStripe)
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, { stripe: stripe.value, options: fakeOptions })
      })

      render(Comp)
      await mockEmbeddedCheckoutPromise

      stripe.value = mocks.mockStripe()
      await nextTick()

      expect(consoleSpy).toHaveBeenCalledWith(
        'Unsupported prop change on EmbeddedCheckoutProvider: You cannot change the `stripe` prop after setting it.',
      )
    })

    it('throws when stripe prop is undefined', () => {
      expect(() => render(makeWrapper(undefined, fakeOptions))).toThrow(
        'Invalid prop `stripe` supplied to `EmbeddedCheckoutProvider`.',
      )
    })

    it('throws when stripe prop is a string', () => {
      expect(() => render(makeWrapper('foo', fakeOptions))).toThrow(
        'Invalid prop `stripe` supplied to `EmbeddedCheckoutProvider`.',
      )
    })

    it('throws when stripe prop is a non-Stripe object', () => {
      expect(() => render(makeWrapper({ wat: 2 }, fakeOptions))).toThrow(
        'Invalid prop `stripe` supplied to `EmbeddedCheckoutProvider`.',
      )
    })
  })

  describe('options prop change warnings', () => {
    it('warns when clientSecret changes after being set', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const options = ref({ clientSecret: 'cs_abc' })
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, { stripe: mockStripe, options: options.value })
      })

      render(Comp)
      await mockEmbeddedCheckoutPromise

      options.value = { clientSecret: 'cs_xyz' }
      await nextTick()

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('You cannot change the client secret after setting it.'),
      )
    })

    it('warns when fetchClientSecret changes after being set', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const options = ref({ fetchClientSecret })
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, { stripe: mockStripe, options: options.value })
      })

      render(Comp)
      await mockEmbeddedCheckoutPromise

      options.value = { fetchClientSecret: () => Promise.resolve('cs_new') }
      await nextTick()

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('You cannot change fetchClientSecret after setting it.'),
      )
    })

    it('warns when onComplete changes after being set', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const onComplete = vi.fn()
      const options = ref<any>({ fetchClientSecret, onComplete })
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, { stripe: mockStripe, options: options.value })
      })

      render(Comp)
      await mockEmbeddedCheckoutPromise

      options.value = { fetchClientSecret, onComplete: vi.fn() }
      await nextTick()

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('You cannot change the onComplete option after setting it.'),
      )
    })

    it('warns when onShippingDetailsChange changes after being set', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const onShippingDetailsChange = vi.fn()
      const options = ref<any>({ fetchClientSecret, onShippingDetailsChange })
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, { stripe: mockStripe, options: options.value })
      })

      render(Comp)
      await mockEmbeddedCheckoutPromise

      options.value = { fetchClientSecret, onShippingDetailsChange: vi.fn() }
      await nextTick()

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('You cannot change the onShippingDetailsChange option after setting it.'),
      )
    })

    it('warns when onLineItemsChange changes after being set', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const onLineItemsChange = vi.fn()
      const options = ref<any>({ fetchClientSecret, onLineItemsChange })
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, { stripe: mockStripe, options: options.value })
      })

      render(Comp)
      await mockEmbeddedCheckoutPromise

      options.value = { fetchClientSecret, onLineItemsChange: vi.fn() }
      await nextTick()

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('You cannot change the onLineItemsChange option after setting it.'),
      )
    })
  })

  describe('lifecycle', () => {
    it('destroys embedded checkout on unmount', async () => {
      const show = ref(true)
      const Comp = defineComponent(() => {
        return () => show.value
          ? h(EmbeddedCheckoutProvider, { stripe: mockStripe, options: fakeOptions })
          : null
      })

      render(Comp)
      await mockEmbeddedCheckoutPromise

      show.value = false
      await nextTick()

      expect(mockEmbeddedCheckout.destroy).toHaveBeenCalledTimes(1)
    })

    it('destroys embedded checkout even if unmounted before initialization completes', async () => {
      let resolveCheckout!: (v: any) => void
      const slowCheckoutPromise = new Promise((resolve) => {
        resolveCheckout = resolve
      })
      mockStripe.initEmbeddedCheckout.mockReturnValue(slowCheckoutPromise)

      const show = ref(true)
      const Comp = defineComponent(() => {
        return () => show.value
          ? h(EmbeddedCheckoutProvider, { stripe: mockStripe, options: fakeOptions })
          : null
      })

      render(Comp)

      // Unmount before initialization resolves
      show.value = false
      await nextTick()

      // Now resolve initialization
      resolveCheckout(mockEmbeddedCheckout)
      await slowCheckoutPromise
      // Flush microtask chain so onUnmounted's .then() cleanup runs
      await Promise.resolve()
      await Promise.resolve()

      expect(mockEmbeddedCheckout.destroy).toHaveBeenCalledTimes(1)
    })

    it('does not retain embedded checkout after unmount during async initialization', async () => {
      let resolveStripe!: (value: any) => void
      const slowStripePromise: Promise<any> = new Promise((resolve) => {
        resolveStripe = resolve
      })
      let providedContext: any

      const Consumer = defineComponent(() => {
        providedContext = useEmbeddedCheckoutContext()
        return () => null
      })
      const Comp = defineComponent(() => {
        return () => h(EmbeddedCheckoutProvider, {
          stripe: slowStripePromise,
          options: fakeOptions,
        }, () => h(Consumer))
      })

      const view = render(Comp)
      view.unmount()

      resolveStripe(mockStripe)
      await slowStripePromise
      await Promise.resolve()
      await Promise.resolve()

      expect(providedContext.embeddedCheckout.value).toBe(null)
    })
  })
})
