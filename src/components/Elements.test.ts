import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, onMounted, ref } from 'vue'
import * as mocks from '../../test/mocks'
import { Elements, useElements } from './Elements'
import { useStripe } from './useStripe'

describe.skip('elements', () => {
  let mockStripe: any
  let mockElements: any

  beforeEach(() => {
    mockStripe = mocks.mockStripe()
    mockElements = mocks.mockElements()
    mockStripe.elements.mockReturnValue(mockElements)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('injects elements with the useElements composable', () => {
    const child = defineComponent({
      name: 'Child',
      template: '<div />',
      setup() {
        const elements = useElements()

        return {
          elements,
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

    const wrapper = mount(parent)
    expect(wrapper.findComponent({ name: 'Child' }).vm.elements).toBe(mockElements)
  })

  it('only creates elements once', () => {
    const child = defineComponent({
      name: 'Child',
      template: '<div />',
      setup() {
        const _ = useElements()

        return {}
      },
    })

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: mockStripe,
        }, () => h(child))
      },
    })

    mount(parent)

    expect(mockStripe.elements).toHaveBeenCalledTimes(1)
  })

  it('injects stripe with the useStripe composable', () => {
    const child = defineComponent({
      name: 'Child',
      template: '<div />',
      setup() {
        const stripe = useStripe()

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

    const wrapper = mount(parent)
    expect(wrapper.findComponent({ name: 'Child' }).vm.stripe).toBe(mockStripe)
  })

  it('provides given stripe instance on mount', () => {
    const child = defineComponent({
      name: 'Child',
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
      mount(parent)
    }).not.toThrow('Stripe instance is null')
  })

  it('allows a transition from null to a valid Stripe object', async () => {
    const stripeProp = ref(null)
    const child = defineComponent({
      name: 'Child',
      template: '<div />',
      setup() {
        const elements = useElements()

        return {
          elements,
        }
      },
    })

    const parent = defineComponent({
      setup() {
        return () => h(Elements, {
          stripe: stripeProp.value,
        }, () => h(child))
      },
    })

    const wrapper = mount(parent)
    expect(wrapper.findComponent({ name: 'Child' }).vm.elements).toBe(null)

    stripeProp.value = mockStripe
    await nextTick()
    expect(wrapper.findComponent({ name: 'Child' }).vm.elements).toBe(mockElements)
  })

  it('throws when trying to call useElements outside of Elements context', () => {
    const parent = defineComponent({
      name: 'Child',
      template: '<div />',
      setup() {
        const elements = useElements()

        return {
          elements,
        }
      },
    })

    expect(() => {
      mount(parent)
    }).toThrow('Could not find Elements context; You need to wrap the part of your app that calls useElements() in an <Elements> provider.')
  })

  it('throws when trying to call useStripe outside of Elements context', () => {
    const parent = defineComponent({
      name: 'Child',
      template: '<div />',
      setup() {
        const stripe = useStripe()

        return {
          stripe,
        }
      },
    })

    expect(() => {
      mount(parent)
    }).toThrow('Could not find Elements context; You need to wrap the part of your app that calls useStripe() in an <Elements> provider.')
  })

  it('allows changes to options via elements.update', async () => {
    const parent = defineComponent({
      setup() {
        const options = ref<Record<string, any>>({ foo: 'foo' })

        onMounted(() => {
          options.value = { bar: 'bar' }
        })

        return () => h(Elements, {
          stripe: mockStripe,
          options: options.value,
        })
      },
    })

    mount(parent)

    expect(mockStripe.elements).toHaveBeenCalledWith({ foo: 'foo' })
    await nextTick()
    expect(mockElements.update).toHaveBeenCalledWith({ bar: 'bar' })
  })
})
