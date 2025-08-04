import { render } from '@testing-library/vue';
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, watchEffect } from 'vue'
import * as mocks from '../../test/mocks'
import { createElementComponent } from './createElementComponent'

import { Elements } from './Elements'

describe('createElementComponent', () => {
  let mockStripe: any
  let mockElements: any
  let mockElement: any
  let mockCheckoutSdk: any

  let simulateElementsEvents: Record<string, any[]>
  let simulateOn: any
  let simulateOff: any
  const simulateEvent = (event: string, ...args: any[]) => {
    simulateElementsEvents[event].forEach(fn => fn(...args))
  }

  beforeEach(() => {
    mockStripe = mocks.mockStripe()
    mockElements = mocks.mockElements()
    mockCheckoutSdk = mocks.mockCheckoutSdk()
    mockElement = mocks.mockElement()
    mockStripe.elements.mockReturnValue(mockElements)
    mockElements.create.mockReturnValue(mockElement)
    mockStripe.initCheckout.mockResolvedValue(mockCheckoutSdk)
    mockCheckoutSdk.createPaymentElement.mockReturnValue(mockElement)
    mockCheckoutSdk.createBillingAddressElement.mockReturnValue(mockElement)
    mockCheckoutSdk.createShippingAddressElement.mockReturnValue(mockElement)
    mockCheckoutSdk.createExpressCheckoutElement.mockReturnValue(mockElement)

    simulateElementsEvents = {}
    simulateOn = vi.fn((event, fn) => {
      simulateElementsEvents[event] = [
        ...(simulateElementsEvents[event] || []),
        fn,
      ]
    })
    simulateOff = vi.fn((event, fn) => {
      simulateElementsEvents[event] = simulateElementsEvents[event].filter(
        previouslyAddedFn => previouslyAddedFn !== fn,
      )
    })

    mockElement.on = simulateOn
    mockElement.off = simulateOff
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const CardElement = createElementComponent('card')

  it('can remove and add CardElement at the same time', () => {
    let cardMounted = false
    mockElement.mount.mockImplementation(() => {
      if (cardMounted) {
        throw new Error('Card already mounted')
      }
      cardMounted = true
    })
    mockElement.destroy.mockImplementation(() => {
      cardMounted = false
    })

    const key = ref(1)
    const child = defineComponent(() => {
      return () => h(CardElement, { key: key.value })
    })

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(child))
      },
    })

    mount(parent)

    key.value++

    expect(mockElement.mount).toHaveBeenCalledTimes(2)
  })

  it('stores the element component`s type as a static property', () => {
    expect((CardElement as any).__elementType).toBe('card')
  })

  it('passes id to the wrapping DOM element', () => {
    const parent = defineComponent(() => {
      return () => h(Elements, { stripe: mockStripe }, () => h(CardElement, { id: 'foo' }))
    })

    const { container } = render(parent)

    const elementContainer = container.firstElementChild as Element

    expect(elementContainer.id).toBe('foo')
  })

  it('passes class to the wrapping DOM element', () => {
    const parent = defineComponent(() => {
      return () => h(Elements, { stripe: mockStripe }, () => h(CardElement, { class: 'bar' }))
    })

    const { container } = render(parent)

    const elementContainer = container.firstElementChild as Element

    expect(elementContainer.className).toBe('bar')
  })

  it('creates the element with options', async () => {
    const options: any = { foo: 'foo' }

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, { options }))
      },
    })

    const wrapper = render(parent)

    await nextTick()
    expect(mockElements.create).toHaveBeenCalledWith('card', options)

    expect(Object.keys(wrapper.emitted()).length).toBe(0)
    expect(simulateOn).not.toBeCalled()
    expect(simulateOff).not.toBeCalled()
  })

  it('mounts the element', async () => {
    const component = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement))
      },
    })

    const { container, emitted } = render(component)

    // TODO: Fix this line
    expect(mockElement.mount).toHaveBeenCalledWith(container.firstElementChild)

    expect(simulateOn).not.toBeCalled()
    expect(simulateOff).not.toBeCalled()
    expect(Object.keys(emitted()).length).toBe(0)
  })

  it.only('does not create and mount until Elements has been instantiated', async () => {
    const component = defineComponent({
      props: {
        stripe: {
          type: Object,
          required: false,
        }
      },
      setup(props) {
        return () => h(Elements, {
          stripe: props.stripe || null,
        }, () => h(CardElement))
      },
    })

    const { rerender } = render(component)

    expect(mockElement.mount).not.toHaveBeenCalled()
    expect(mockElements.create).not.toHaveBeenCalled()

    await rerender({
      stripe: mockStripe
    })

    expect(mockElement.mount).toHaveBeenCalled()
    expect(mockElements.create).toHaveBeenCalled()
  })

  it('throws when the Element is mounted outside of Elements context', () => {
    // Prevent the console.errors to keep the test output clean
    vi.spyOn(console, 'error');
    (console.error as any).mockImplementation(() => {})

    expect(() => {
      mount(CardElement)
    }).toThrow(
      'Could not find Elements context; You need to wrap the part of your app that mounts <CardElement> in an <Elements> provider.',
    )
  })

  it('adds an event handlers to an Element', async () => {
    const mockHandler = vi.fn()

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onChange: mockHandler,
        }))
      },
    })

    mount(parent)
    await nextTick()

    const changeEventMock = Symbol('change')
    simulateEvent('change', changeEventMock)
    expect(mockHandler).toHaveBeenCalledWith(changeEventMock)
  })
})
