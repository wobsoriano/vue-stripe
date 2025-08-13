import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { renderComposable } from 'vue-composable-testing'
import * as mocks from '../../test/mocks'
import { Elements, useElements } from './Elements'
import { useStripe } from './useStripe'

describe('elements', () => {
  let mockStripe: any
  let mockStripePromise: any
  let mockElements: any
  // let consoleError: any
  let consoleWarn: any

  beforeEach(() => {
    mockStripe = mocks.mockStripe()
    mockStripePromise = Promise.resolve(mockStripe)
    mockElements = mocks.mockElements()
    mockStripe.elements.mockReturnValue(mockElements)

    vi.spyOn(console, 'error')
    vi.spyOn(console, 'warn')
    // consoleError = console.error
    consoleWarn = console.warn
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('injects elements with the useElements composable', () => {
    const { result } = renderComposable(() => useElements(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(Elements, {
            stripe: mockStripe,
          }, () => slots.default?.())
        },
      }),
    })

    expect(result.value).toStrictEqual(mockElements)
  })

  it('only creates elements once', () => {
    renderComposable(() => useElements(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(Elements, {
            stripe: mockStripe,
          }, () => slots.default?.())
        },
      }),
    })

    expect(mockStripe.elements).toHaveBeenCalledTimes(1)
  })

  it('injects stripe with the useStripe composable', () => {
    const { result } = renderComposable(() => useStripe(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(Elements, {
            stripe: mockStripe,
          }, () => slots.default?.())
        },
      }),
    })
    expect(result.value).toStrictEqual(mockStripe)
  })

  it('injects stripe and elements via slots for Options API users', () => {
    const Child = defineComponent({
      props: ['stripe', 'elements'],
      setup(props) {
        expect(props.stripe).toBe(mockStripe)
        expect(props.elements).toBe(mockElements)
        return () => null
      }
    })

    const Parent = defineComponent({
      components: {
        Elements,
        Child,
      },
      setup() {
        return {
          stripe: mockStripe
        }
      },
      template: `
        <Elements :stripe="stripe" v-slot="slotProps">
          <Child :stripe="slotProps.stripe" :elements="slotProps.elements" />
        </Elements>
      `
    })

    render(Parent)
  })

  it('provides given stripe instance on mount', () => {
    const child = defineComponent({
      template: '<div />',
      setup() {
        const stripe = useStripe()

        if (!stripe.value) {
          throw new Error('Stripe instance is null')
        }

        return {
          stripe,
        }
      },
    })

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(child))
      },
    })

    expect(() => {
      render(parent)
    }).not.toThrow('Stripe instance is null')
  })

  it('allows a transition from null to a valid Stripe object', async () => {
    const stripeProp = ref(null)

    const { result } = renderComposable(() => useElements(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(Elements, {
            stripe: stripeProp.value,
          }, () => slots.default?.())
        },
      }),
    })

    expect(result.value).toBe(null)

    stripeProp.value = mockStripe
    await nextTick()
    expect(result.value).toStrictEqual(mockElements)
  })

  it('works with a Promise resolving to a valid Stripe object', async () => {
    const { result } = renderComposable(() => useElements(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(Elements, {
            stripe: mockStripePromise,
          }, () => slots.default?.())
        },
      }),
    })

    expect(result.value).toBe(null)

    await nextTick()
    await nextTick()
    expect(result.value).toStrictEqual(mockElements)
  })

  it('allows a transition from null to a valid Promise', async () => {
    const stripeProp = ref(null)
    const { result } = renderComposable(() => useElements(), {
      wrapper: defineComponent({
        setup(_, { slots }) {
          return () => h(Elements, {
            stripe: stripeProp.value,
          }, () => slots.default?.())
        },
      }),
    })

    expect(result.value).toBe(null)

    stripeProp.value = mockStripePromise
    await nextTick()
    expect(result.value).toBe(null)

    await nextTick()
    expect(result.value).toStrictEqual(mockElements)
  })

  it('throws when trying to call useElements outside of Elements context', () => {
    // Silence console output so test output is less noisy
    consoleWarn.mockImplementation(() => {})
    const parent = defineComponent({
      template: '<div />',
      setup() {
        useElements()

        return {}
      },
    })

    expect(() => {
      render(parent)
    }).toThrow('Could not find Elements context; You need to wrap the part of your app that calls useElements() in an <Elements> provider.')
  })

  it('throws when trying to call useStripe outside of Elements context', () => {
    // Silence console output so test output is less noisy
    consoleWarn.mockImplementation(() => {})
    const parent = defineComponent({
      template: '<div />',
      setup() {
        useStripe()

        return {}
      },
    })

    expect(() => {
      render(parent)
    }).toThrow('Could not find Elements context; You need to wrap the part of your app that calls useStripe() in an <Elements> provider.')
  })

  it('does not allow changes to a set Stripe object', async () => {
    const stripe = ref(mockStripe)
    // Silence console output so test output is less noisy
    consoleWarn.mockImplementation(() => {})

    const Comp = defineComponent(() => {
      return () => h(Elements, { stripe: stripe.value })
    })
    render(Comp)

    const mockStripe2 = mocks.mockStripe()
    stripe.value = mockStripe2

    await waitFor(() => {
      expect(mockStripe.elements.mock.calls).toHaveLength(1)
      expect(mockStripe2.elements.mock.calls).toHaveLength(0)
      expect(consoleWarn).toHaveBeenCalledWith(
        'Unsupported prop change on Elements: You cannot change the `stripe` prop after setting it.',
      )
    })
  })

  it('allows changes to options via elements.update after setting the Stripe object', async () => {
    const options = ref<Record<string, string>>({ foo: 'foo' })
    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
          options: options.value,
        })
      },
    })

    render(parent)

    options.value = { bar: 'bar' }

    expect(mockStripe.elements).toHaveBeenCalledWith({ foo: 'foo' })
    expect(mockStripe.elements).toHaveBeenCalledTimes(1)

    await nextTick()

    expect(mockElements.update).toHaveBeenCalledWith({ bar: 'bar' })
    expect(mockStripe.elements).toHaveBeenCalledTimes(1)
  })
})
