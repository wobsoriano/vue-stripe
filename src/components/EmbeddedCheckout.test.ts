import { render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import * as mocks from '../../test/mocks'
import { EmbeddedCheckout } from './EmbeddedCheckout'
import * as EmbeddedCheckoutProviderModule from './EmbeddedCheckoutProvider'

const { EmbeddedCheckoutProvider } = EmbeddedCheckoutProviderModule

describe('embeddedCheckout on the client', () => {
  let mockStripe: any
  let mockStripePromise: any
  let mockEmbeddedCheckout: any
  let mockEmbeddedCheckoutPromise: any
  let consoleWarn: any
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
    vi.spyOn(console, 'warn')
    consoleWarn = console.warn
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.todo('passes id to the wrapping DOM element', async () => {
    // Silence console output so test output is less noisy
    consoleWarn.mockImplementation(() => {})
    const Comp = defineComponent(() => {
      return () => h(EmbeddedCheckoutProvider, {
        stripe: mockStripePromise,
        options: fakeOptions,
      }, () => h(EmbeddedCheckout, { id: 'foo' }))
    })
    render(Comp)

    await mockStripePromise
    await nextTick()

    render(parent)
    await nextTick()

    // const elementContainer = container.firstChild as Element

    // expect(elementContainer.id).toBe('foo')
  })

  it.todo('passes class to the wrapping DOM element', async () => {
    // Silence console output so test output is less noisy
    consoleWarn.mockImplementation(() => {})
    const Comp = defineComponent(() => {
      return () => h(EmbeddedCheckoutProvider, {
        stripe: mockStripePromise,
        options: fakeOptions,
      }, () => h(EmbeddedCheckout, { class: 'bar' }))
    })
    render(Comp)

    await mockStripePromise
    await nextTick()

    const { container } = render(parent)
    await nextTick()

    const elementContainer = container.firstChild as Element

    expect(elementContainer).toHaveClass('bar')
  })
})
