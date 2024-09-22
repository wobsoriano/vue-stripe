import type { StripeElement, StripeElementType } from '@stripe/stripe-js'
import type { Component, ElementProps, UnknownOptions } from '../types'
import { defineComponent, h, ref, watchEffect } from 'vue'
import { useAttachEvent, useElements } from '../composables'

type UnknownCallback = (...args: unknown[]) => any

interface PrivateElementProps {
  id?: string
  class?: string
  onChange?: UnknownCallback
  onBlur?: UnknownCallback
  onFocus?: UnknownCallback
  onEscape?: UnknownCallback
  onReady?: UnknownCallback
  onClick?: UnknownCallback
  onLoadError?: UnknownCallback
  onLoaderStart?: UnknownCallback
  onNetworksChange?: UnknownCallback
  onConfirm?: UnknownCallback
  onCancel?: UnknownCallback
  onShippingAddressChange?: UnknownCallback
  onShippingRateChange?: UnknownCallback
  options?: UnknownOptions
}

export function createElementComponent({
  type,
}: {
  type: StripeElementType
}) {
  const Element = defineComponent((props: PrivateElementProps, { emit }) => {
    const elements = useElements()
    const element = ref<StripeElement | null>(null)
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

    useAttachEvent(element, 'blur', props.onBlur, emit)
    useAttachEvent(element, 'focus', props.onFocus, emit)
    useAttachEvent(element, 'escape', props.onEscape, emit)
    useAttachEvent(element, 'click', props.onClick, emit)
    useAttachEvent(element, 'loaderror', props.onLoadError, emit)
    useAttachEvent(element, 'loaderstart', props.onLoaderStart, emit)
    useAttachEvent(element, 'networkschange', props.onNetworksChange, emit)
    useAttachEvent(element, 'confirm', props.onConfirm, emit)
    useAttachEvent(element, 'cancel', props.onCancel, emit)
    useAttachEvent(element, 'shippingaddresschange', props.onShippingAddressChange, emit)
    useAttachEvent(element, 'shippingratechange', props.onShippingRateChange, emit)
    useAttachEvent(element, 'change', props.onChange, emit)

    return () => h('div', {
      ref: domRef,
      id: props.id,
      class: props.class,
    })
  }, {
    inheritAttrs: false,
    props: ['id', 'class', 'options'],
    emits: [
      'blur',
      'focus',
      'escape',
      'click',
      'loaderror',
      'loaderstart',
      'networkschange',
      'confirm',
      'cancel',
      'shippingaddresschange',
      'shippingratechange',
      'change',
    ],
  })

  ;(Element as any).__elementType = type

  return Element as Component<ElementProps>
}
