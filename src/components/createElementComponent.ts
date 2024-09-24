import type * as stripeJs from '@stripe/stripe-js'
import { defineComponent, h, ref, watchEffect } from 'vue'
import { useAttachEvent, useElements } from '../composables'
import { useCustomCheckout } from './CustomCheckout'

export function createElementComponent<Props extends Record<string, any>, Emits extends { (e: any, value: any): void }>(
  type: stripeJs.StripeElementType,
) {
  const wrapper = defineComponent((props: {
    id?: string
    class?: string
    options?: Props
  }, { slots, emit }) => {
    const elements = useElements()
    const customCheckoutSdk = useCustomCheckout()
    const element = ref<stripeJs.StripeElement | null>(null)
    const domRef = ref<HTMLDivElement | null>(null)

    watchEffect(() => {
      if (element.value === null && domRef.value !== null && (customCheckoutSdk.value || elements.value)) {
        let newElement: stripeJs.StripeElement | null = null

        if (customCheckoutSdk.value) {
          newElement = customCheckoutSdk.value.createElement(type as any, props.options)
        }
        else if (elements.value) {
          newElement = elements.value.create(type as any, props.options)
        }

        element.value = newElement

        if (newElement) {
          newElement.mount(domRef.value)
        }
      }
    })

    useAttachEvent(element, 'blur', emit)
    useAttachEvent(element, 'focus', emit)
    useAttachEvent(element, 'escape', emit)
    useAttachEvent(element, 'click', emit)
    useAttachEvent(element, 'loaderror', emit)
    useAttachEvent(element, 'loaderstart', emit)
    useAttachEvent(element, 'networkschange', emit)
    useAttachEvent(element, 'confirm', emit)
    useAttachEvent(element, 'cancel', emit)
    useAttachEvent(element, 'shippingaddresschange', emit)
    useAttachEvent(element, 'shippingratechange', emit)
    useAttachEvent(element, 'change', emit)

    const emitElement = type !== 'expressCheckout'
    useAttachEvent(element, 'ready', emit, emitElement)

    return () => h('div', {
      id: props.id,
      class: props.class,
      ref: domRef,
    }, slots)
  })

  return wrapper as typeof wrapper & {
    new (...args: any): {
      $emit: Emits
    }
  }
}
