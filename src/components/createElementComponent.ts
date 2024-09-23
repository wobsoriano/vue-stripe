import type * as stripeJs from '@stripe/stripe-js'
import { defineComponent, h, ref, watchEffect } from 'vue'
import { useAttachEvent, useElements } from '../composables'

export function createElementComponent<Props extends Record<string, any>, Emits extends { (e: any, value: any): void }>(
  type: stripeJs.StripeElementType,
) {
  const wrapper = defineComponent((props: {
    id?: string
    class?: string
    options?: Props
  }, { slots, emit }) => {
    const elements = useElements()
    const element = ref<stripeJs.StripeElement | null>(null)
    const domRef = ref<HTMLDivElement | null>(null)

    watchEffect((onInvalidate) => {
      if (!domRef.value || !elements.value) {
        return
      }

      const newElement = elements.value.create(type as any, props.options)
      newElement.mount(domRef.value)

      element.value = newElement

      onInvalidate(() => {
        newElement.unmount()
      })
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
