import type { StripeErrorType } from '@stripe/stripe-js'
import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import * as mocks from '../../test/mocks'
import { IssuingDisclosure } from './IssuingDisclosure'

const apiError: StripeErrorType = 'api_error'

function mockSuccessfulStripeJsCall() {
  return {
    ...mocks.mockStripe(),
    createIssuingDisclosure: vi.fn(() =>
      Promise.resolve({
        htmlElement: document.createElement('div'),
      }),
    ),
  }
}

function mockStripeJsWithError() {
  return {
    ...mocks.mockStripe(),
    createIssuingDisclosure: vi.fn(() =>
      Promise.resolve({
        error: {
          type: apiError,
          message: 'This is a test error',
        },
      }),
    ),
  }
}

describe('<IssuingDisclosure>', () => {
  let mockStripe: any
  let mockStripePromise: any

  beforeEach(() => {
    mockStripe = mockSuccessfulStripeJsCall()
    mockStripePromise = Promise.resolve(mockStripe)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render', () => {
    const Comp = defineComponent(() => {
      return () => h(IssuingDisclosure, {
        stripe: mockStripePromise,
      })
    })
    render(Comp)
  })

  it('should render with options', () => {
    const options = {
      issuingProgramID: 'iprg_123',
      publicCardProgramName: 'My Cool Card Program',
      learnMoreLink: 'https://test.com',
    }
    const Comp = defineComponent(() => {
      return () => h(IssuingDisclosure, {
        stripe: mockStripePromise,
        options,
      })
    })
    render(Comp)
  })

  it('should render when there is an error', () => {
    mockStripe = mockStripeJsWithError()
    const Comp = defineComponent(() => {
      return () => h(IssuingDisclosure, {
        stripe: mockStripe,
      })
    })
    render(Comp)
  })

  it('should emit load event when disclosure loads', async () => {
    const wrapper = render(IssuingDisclosure, {
      props: {
        stripe: mockStripePromise,
      },
    })
    await mockStripePromise
    await nextTick()
    await nextTick()
    expect(wrapper.emitted()).toHaveProperty('load')
  })

  it('should not emit load if there is an error', async () => {
    mockStripe = mockStripeJsWithError()
    const wrapper = render(IssuingDisclosure, {
      props: {
        stripe: mockStripe,
      },
    })
    await mockStripe
    await nextTick()
    expect(wrapper.emitted()).not.toHaveProperty('load')
  })

  it('should emit error event when there is an error', async () => {
    mockStripe = mockStripeJsWithError()
    const wrapper = render(IssuingDisclosure, {
      props: {
        stripe: mockStripe,
      },
    })
    await mockStripe
    await nextTick()
    expect(wrapper.emitted()).toHaveProperty('error')
  })

  it('should not emit error if there is no error', async () => {
    const wrapper = render(IssuingDisclosure, {
      props: {
        stripe: mockStripePromise,
      },
    })
    await mockStripePromise
    await nextTick()
    expect(wrapper.emitted()).not.toHaveProperty('error')
  })

  it('does not mount until Stripe instance is available', async () => {
    const stripe = ref(null)
    const Comp = defineComponent(() => {
      return () => h(IssuingDisclosure, {
        stripe: stripe.value,
      })
    })
    render(Comp)
    expect(mockStripe.createIssuingDisclosure).not.toHaveBeenCalled()

    stripe.value = mockStripe
    await nextTick()
    await waitFor(() => {
      expect(mockStripe.createIssuingDisclosure).toHaveBeenCalled()
    })
  })

  it('recreates disclosure when options change', async () => {
    const options = ref({
      issuingProgramID: 'iprg_123',
    })
    const Comp = defineComponent(() => {
      return () => h(IssuingDisclosure, {
        stripe: mockStripePromise,
        options: options.value,
      })
    })
    render(Comp)

    await mockStripePromise
    await nextTick()

    const initialCallCount = mockStripe.createIssuingDisclosure.mock.calls.length

    options.value = {
      issuingProgramID: 'iprg_456',
    }
    await nextTick()

    expect(mockStripe.createIssuingDisclosure.mock.calls.length).toBeGreaterThan(initialCallCount)
  })
})
