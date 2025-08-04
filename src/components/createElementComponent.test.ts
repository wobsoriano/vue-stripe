import type { UnknownOptions } from '../types'
import { render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import * as mocks from '../../test/mocks'
import * as CheckoutModule from './CheckoutProvider'
import { createElementComponent } from './createElementComponent'
import * as ElementsModule from './Elements'

const { Elements } = ElementsModule

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

  it('can remove and add CardElement at the same time', async () => {
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
    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
          key: key.value,
        }, () => h(CardElement))
      },
    })

    render(parent)
    await nextTick()

    key.value++
    await nextTick()

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

    await nextTick()
    expect(mockElement.mount).toHaveBeenCalledWith(container.firstElementChild)

    expect(simulateOn).not.toBeCalled()
    expect(simulateOff).not.toBeCalled()
    expect(Object.keys(emitted()).length).toBe(0)
  })

  it('does not create and mount until Elements has been instantiated', async () => {
    const stripe = shallowRef(null)

    const component = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: stripe.value,
        }, () => h(CardElement))
      },
    })

    render(component)

    expect(mockElement.mount).not.toHaveBeenCalled()
    expect(mockElements.create).not.toHaveBeenCalled()

    stripe.value = mockStripe
    await nextTick()

    expect(mockElement.mount).toHaveBeenCalled()
    expect(mockElements.create).toHaveBeenCalled()
  })

  it('throws when the Element is mounted outside of Elements context', () => {
    // Prevent the console.errors to keep the test output clean
    vi.spyOn(console, 'error');
    (console.error as any).mockImplementation(() => {})

    expect(() => {
      render(CardElement)
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

    render(parent)
    await nextTick()

    const changeEventMock = Symbol('change')
    simulateEvent('change', changeEventMock)
    expect(mockHandler).toHaveBeenCalledWith(changeEventMock)
  })

  it('attaches event listeners once the element is created', async () => {
    const elementsRef = shallowRef(null)
    const stripeRef = shallowRef(null)

    vi.spyOn(CheckoutModule, 'useElementsOrCheckoutSdkContextWithUseCase').mockReturnValue({ elements: elementsRef, stripe: stripeRef })

    const mockHandler = vi.fn()

    // This won't create the element, since elements is undefined on this render
    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onChange: mockHandler,
        }))
      },
    })
    // This won't create the element, since elements is undefined on this render
    render(parent)
    expect(mockElements.create).not.toBeCalled()

    expect(simulateOn).not.toBeCalled()

    // This creates the element now that elements is defined
    elementsRef.value = mockElements
    stripeRef.value = mockStripe
    await nextTick()

    expect(mockElements.create).toBeCalled()

    expect(simulateOn).toBeCalledWith('change', expect.any(Function))
    expect(simulateOff).not.toBeCalled()

    const changeEventMock = Symbol('change')
    simulateEvent('change', changeEventMock)
    expect(mockHandler).toHaveBeenCalledWith(changeEventMock)
  })

  it('removes event handler when removed on re-render', async () => {
    const mockHandler = vi.fn()
    const key = ref(0)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
          key: key.value,
        }, () => h(CardElement, {
          onChange: mockHandler,
        }))
      },
    })

    render(parent)
    await nextTick()

    expect(simulateOn).toBeCalledWith('change', expect.any(Function))
    expect(simulateOff).not.toBeCalled()

    key.value++
    await nextTick()

    expect(simulateOff).toBeCalledWith('change', expect.any(Function))
  })

  it('does not call on/off when an event handler changes', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onChange = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onChange: onChange.value,
        }))
      },
    })

    render(parent)
    await nextTick()

    expect(simulateOn).toBeCalledWith('change', expect.any(Function))

    onChange.value = mockHandler2
    await nextTick()

    expect(simulateOn).toBeCalledTimes(1)
    expect(simulateOff).not.toBeCalled()
  })

  it('propagates the Element`s ready event to the current onReady prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onReady = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onReady: onReady.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onReady.value = mockHandler2
    await nextTick()

    const mockEvent = Symbol('ready')
    simulateEvent('ready', mockEvent)
    expect(mockHandler2).toHaveBeenCalledWith(mockElement)
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('propagates the Element`s change event to the current onChange prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onChange = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onChange: onChange.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onChange.value = mockHandler2
    await nextTick()

    const changeEventMock = Symbol('change')
    simulateEvent('change', changeEventMock)
    expect(mockHandler2).toHaveBeenCalledWith(changeEventMock)
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('propagates the Element`s blur event to the current onBlur prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onBlur = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onBlur: onBlur.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onBlur.value = mockHandler2
    await nextTick()

    simulateEvent('blur')
    expect(mockHandler2).toHaveBeenCalledWith()
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('propagates the Element`s focus event to the current onFocus prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onFocus = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onFocus: onFocus.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onFocus.value = mockHandler2
    await nextTick()

    simulateEvent('focus')
    expect(mockHandler2).toHaveBeenCalledWith()
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('propagates the Element`s escape event to the current onEscape prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onEscape = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onEscape: onEscape.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onEscape.value = mockHandler2
    await nextTick()

    simulateEvent('escape')
    expect(mockHandler2).toHaveBeenCalledWith()
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('propagates the Element`s click event to the current onClick prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onClick = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onClick: onClick.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onClick.value = mockHandler2
    await nextTick()

    simulateEvent('click')
    expect(mockHandler2).toHaveBeenCalledWith()
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('propagates the Element`s loaderror event to the current onLoaderror prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onLoadError = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onLoaderror: onLoadError.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onLoadError.value = mockHandler2
    await nextTick()

    const loadErrorEventMock = Symbol('loaderror')
    simulateEvent('loaderror', loadErrorEventMock)
    expect(mockHandler2).toHaveBeenCalledWith(loadErrorEventMock)
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('propagates the Element`s loaderstart event to the current onLoaderstart prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onLoaderStart = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onLoaderstart: onLoaderStart.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onLoaderStart.value = mockHandler2
    await nextTick()

    simulateEvent('loaderstart')
    expect(mockHandler2).toHaveBeenCalledWith()
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('propagates the Element`s networkschange event to the current onNetworkschange prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onNetworksChange = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onNetworkschange: onNetworksChange.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onNetworksChange.value = mockHandler2
    await nextTick()

    simulateEvent('networkschange')
    expect(mockHandler2).toHaveBeenCalledWith()
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('propagates the Element`s confirm event to the current onConfirm prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onConfirm = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onConfirm: onConfirm.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onConfirm.value = mockHandler2
    await nextTick()

    const confirmEventMock = Symbol('confirm')
    simulateEvent('confirm', confirmEventMock)
    expect(mockHandler2).toHaveBeenCalledWith(confirmEventMock)
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('propagates the Element`s cancel event to the current onCancel prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onCancel = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onCancel: onCancel.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onCancel.value = mockHandler2
    await nextTick()

    const cancelEventMock = Symbol('cancel')
    simulateEvent('cancel', cancelEventMock)
    expect(mockHandler2).toHaveBeenCalledWith(cancelEventMock)
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('propagates the Element`s shippingaddresschange event to the current onShippingaddresschange prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onShippingAddressChange = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onShippingaddresschange: onShippingAddressChange.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onShippingAddressChange.value = mockHandler2
    await nextTick()

    const shippingAddressChangeEventMock = Symbol('shippingaddresschange')
    simulateEvent('shippingaddresschange', shippingAddressChangeEventMock)
    expect(mockHandler2).toHaveBeenCalledWith(shippingAddressChangeEventMock)
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('propagates the Element`s shippingratechange event to the current onShippingratechange prop', async () => {
    const mockHandler = vi.fn()
    const mockHandler2 = vi.fn()
    const onShippingRateChange = ref(mockHandler)

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, {
          onShippingratechange: onShippingRateChange.value,
        }))
      },
    })
    render(parent)
    await nextTick()

    onShippingRateChange.value = mockHandler2
    await nextTick()

    const shippingRateChangeEventMock = Symbol('shippingratechange')
    simulateEvent('shippingratechange', shippingRateChangeEventMock)
    expect(mockHandler2).toHaveBeenCalledWith(shippingRateChangeEventMock)
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('updates the Element when options change', async () => {
    const options = ref({ style: { base: { fontSize: '20px' } } })
    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, { options: options.value }))
      },
    })

    render(parent)

    options.value.style.base.fontSize = '30px'
    await nextTick()

    expect(mockElement.update).toHaveBeenCalledWith({
      style: { base: { fontSize: '30px' } },
    })

    options.value = { style: { base: { fontSize: '40px' } } }
    await nextTick()

    expect(mockElement.update).toHaveBeenCalledWith({
      style: { base: { fontSize: '40px' } },
    })
  })

  it('does not trigger unnecessary updates', async () => {
    const options = ref({ style: { base: { fontSize: '20px' } } })
    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement, { options: options.value }))
      },
    })

    render(parent)

    options.value.style.base.fontSize = '20px'
    await nextTick()

    expect(mockElement.update).not.toHaveBeenCalled()
  })

  it.todo('warns on changes to non-updatable options', () => { })

  it('destroys an existing Element when the component unmounts', async () => {
    const component = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: null,
        }, () => h(CardElement))
      },
    })
    const { unmount } = render(component)
    unmount()

    // not called when Element has not been mounted (because stripe is still loading)
    expect(mockElement.destroy).not.toHaveBeenCalled()

    const component2 = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(CardElement))
      },
    })
    const { unmount: unmount2 } = render(component2)
    await nextTick()
    unmount2()
    expect(mockElement.destroy).toHaveBeenCalled()
  })

  it('destroys an existing Element when the component unmounts with an async stripe prop', async () => {
    const stripePromise = Promise.resolve(mockStripe)

    const component = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: stripePromise as any,
        }, () => h(CardElement))
      },
    })
    const { unmount } = render(component)

    await nextTick()
    await stripePromise

    unmount()
    expect(mockElement.destroy).toHaveBeenCalled()
  })

  it('updates the Element when options change from null to non-null value', async () => {
    const options = ref<UnknownOptions | null>(null)
    const component = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
          // @ts-expect-error: options is required
        }, () => h(CardElement, { options: options.value }))
      },
    })
    render(component)

    options.value = { style: { base: { fontSize: '30px' } } }
    await nextTick()

    expect(mockElement.update).toHaveBeenCalledWith({
      style: { base: { fontSize: '30px' } },
    })
  })
})
