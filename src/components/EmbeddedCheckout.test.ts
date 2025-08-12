import { render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import * as mocks from '../../test/mocks'
import { EmbeddedCheckout } from './EmbeddedCheckout'
import * as EmbeddedCheckoutProviderModule from './EmbeddedCheckoutProvider'

const { EmbeddedCheckoutProvider } = EmbeddedCheckoutProviderModule

describe('embeddedCheckout on the client', () => {
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
    mockStripe.initEmbeddedCheckout.mockReturnValue(
      mockEmbeddedCheckoutPromise,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('passes id to the wrapping DOM element', async () => {
    const Comp = defineComponent(() => {
      return () => h(EmbeddedCheckoutProvider, {
        stripe: mockStripePromise,
        options: fakeOptions,
      }, () => h(EmbeddedCheckout, { id: 'foo' }))
    })
    const { container } = render(Comp)

    const elementContainer = container.firstElementChild as Element

    expect(elementContainer.id).toBe('foo')
  })

  it('passes class to the wrapping DOM element', async () => {
    const Comp = defineComponent(() => {
      return () => h(EmbeddedCheckoutProvider, {
        stripe: mockStripePromise,
        options: fakeOptions,
      }, () => h(EmbeddedCheckout, { class: 'bar' }))
    })
    const { container } = render(Comp)

    const elementContainer = container.firstElementChild as Element

    expect(elementContainer).toHaveClass('bar')
  })

  it('mounts Embedded Checkout', async () => {
    const Comp = defineComponent(() => {
      return () => h(EmbeddedCheckoutProvider, {
        stripe: mockStripe,
        options: fakeOptions,
      }, () => h(EmbeddedCheckout))
    })
    const { container } = render(Comp)

    await mockEmbeddedCheckoutPromise

    expect(mockEmbeddedCheckout.mount).toBeCalledWith(container.firstElementChild)
  })

  it('does not mount until Embedded Checkout has been initialized', async () => {
    const stripe = ref(null)
    const options = ref({
      fetchClientSecret: null,
    })
    // Render with no stripe instance and client secret
    const Comp = defineComponent(() => {
      return () => h(EmbeddedCheckoutProvider, {
        stripe: stripe.value,
        options: options.value,
      }, () => h(EmbeddedCheckout))
    })
    const { container } = render(Comp)
    expect(mockEmbeddedCheckout.mount).not.toBeCalled()

    // Set stripe prop
    stripe.value = mockStripe
    expect(mockEmbeddedCheckout.mount).not.toBeCalled()

    // Set fetchClientSecret
    options.value.fetchClientSecret = fetchClientSecret
    expect(mockEmbeddedCheckout.mount).not.toBeCalled()

    await nextTick()
    await mockEmbeddedCheckoutPromise

    expect(mockEmbeddedCheckout.mount).toBeCalledWith(container.firstElementChild)
  })

  it('unmounts Embedded Checkout when the component unmounts', async () => {
    const rerenderKey = ref(0)
    const Comp = defineComponent(() => {
      return () => h(EmbeddedCheckoutProvider, {
        stripe: mockStripe,
        options: fakeOptions,
      }, () => h(EmbeddedCheckout, { key: rerenderKey.value }))
    })
    const { container } = render(Comp)

    await mockEmbeddedCheckoutPromise

    expect(mockEmbeddedCheckout.mount).toBeCalledWith(container.firstElementChild)

    rerenderKey.value++

    await nextTick()
    expect(mockEmbeddedCheckout.unmount).toBeCalled()
  })

  it('does not throw when the Embedded Checkout instance is already destroyed when unmounting', async () => {
    const rerenderKey = ref(0)
    const Comp = defineComponent(() => {
      return () => h(EmbeddedCheckoutProvider, {
        stripe: mockStripe,
        options: fakeOptions,
      }, () => h(EmbeddedCheckout, { key: rerenderKey.value }))
    })
    const { container } = render(Comp)

    await mockEmbeddedCheckoutPromise

    expect(mockEmbeddedCheckout.mount).toBeCalledWith(container.firstElementChild)

    mockEmbeddedCheckout.unmount.mockImplementation(() => {
      throw new Error('instance has been destroyed')
    })

    expect(() => {
      rerenderKey.value++
    }).not.toThrow()
  })
})
