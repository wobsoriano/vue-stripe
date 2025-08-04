import type * as stripeJs from '@stripe/stripe-js'
import type { ShallowRef } from 'vue'
import { defineComponent, h, onUnmounted, ref, shallowRef, toRaw, watch, watchEffect } from 'vue'
import { useElementsOrCheckoutSdkContextWithUseCase } from './CheckoutProvider'

const capitalized = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

interface PrivateElementProps<T> {
  id?: string
  class?: string
  options?: T
}

export function createElementComponent<Props extends Record<string, any>, Emits extends { (e: any, value: any): void }>(
  type: stripeJs.StripeElementType,
) {
  const displayName = `${capitalized(type)}Element`

  const Element = defineComponent((props: PrivateElementProps<Props>, { emit }) => {
    const ctx = useElementsOrCheckoutSdkContextWithUseCase(`mounts <${displayName}>`)
    const elements = 'elements' in ctx ? ctx.elements : null
    const checkoutSdk = 'checkoutSdk' in ctx ? ctx.checkoutSdk : null
    const elementRef = shallowRef<stripeJs.StripeElement | null>(null)
    const domRef = ref<HTMLDivElement | null>(null)

    watchEffect(() => {
      if (elementRef.value === null && domRef.value !== null && (elements?.value || checkoutSdk?.value)) {
        let newElement: stripeJs.StripeElement | null = null

        if (checkoutSdk?.value) {
          switch (type) {
            case 'payment':
              newElement = checkoutSdk.value.createPaymentElement(props.options)
              break
            case 'address':
              if ('mode' in props.options!) {
                const { mode, ...restOptions } = props.options
                if (mode === 'shipping') {
                  newElement = checkoutSdk.value.createShippingAddressElement(restOptions)
                }
                else if (mode === 'billing') {
                  newElement = checkoutSdk.value.createBillingAddressElement(restOptions)
                }
                else {
                  throw new Error('Invalid options.mode. mode must be \'billing\' or \'shipping\'.')
                }
              }
              else {
                throw new Error(
                  'You must supply options.mode. mode must be \'billing\' or \'shipping\'.',
                )
              }
              break
            case 'expressCheckout':
              newElement = checkoutSdk.value.createExpressCheckoutElement(
                props.options as any,
              ) as stripeJs.StripeExpressCheckoutElement
              break
            case 'currencySelector':
              newElement = checkoutSdk.value.createCurrencySelectorElement()
              break
            case 'taxId':
              newElement = checkoutSdk.value.createTaxIdElement(props.options)
              break
            default:
              throw new Error(
                `Invalid Element type ${displayName}. You must use either the <PaymentElement />, <AddressElement options={{mode: 'shipping'}} />, <AddressElement options={{mode: 'billing'}} />, or <ExpressCheckoutElement />.`,
              )
          }
        }
        else if (elements?.value) {
          newElement = elements.value.create(type as any, props.options)
        }

        // Store element in state to facilitate event listener attachment
        elementRef.value = newElement

        if (newElement) {
          newElement.mount(domRef.value)
        }
      }
    })

    watch(() => props.options, (options) => {
      if (!elementRef.value || !options) {
        return
      }

      // @ts-expect-error: TODO, why is update method not typed
      elementRef.value.update(options)
    })

    // For every event where the merchant provides a callback, call element.on
    // with that callback. If the merchant ever changes the callback, removes
    // the old callback with element.off and then call element.on with the new one.
    useAttachEvent(elementRef, 'blur', emit)
    useAttachEvent(elementRef, 'focus', emit)
    useAttachEvent(elementRef, 'escape', emit)
    useAttachEvent(elementRef, 'click', emit)
    useAttachEvent(elementRef, 'loaderror', emit)
    useAttachEvent(elementRef, 'loaderstart', emit)
    useAttachEvent(elementRef, 'networkschange', emit)
    useAttachEvent(elementRef, 'confirm', emit)
    useAttachEvent(elementRef, 'cancel', emit)
    useAttachEvent(elementRef, 'shippingaddresschange', emit)
    useAttachEvent(elementRef, 'shippingratechange', emit)
    useAttachEvent(elementRef, 'change', emit)

    const emitElement = type !== 'expressCheckout'
    useAttachEvent(elementRef, 'ready', emit, emitElement)

    onUnmounted(() => {
      const currentElement = elementRef.value
      if (currentElement && typeof currentElement.destroy === 'function') {
        try {
          currentElement.destroy()
        }
        catch {}
      }
    })

    return () => h('div', {
      id: props.id,
      class: props.class,
      ref: domRef,
    })
  }, {
    inheritAttrs: false,
    name: displayName,
    props: ['id', 'class', 'options'],
  })

  ;(Element as any).__elementType = type

  return Element as typeof Element & {
    new (...args: any): {
      $emit: Emits
    }
  }
}

export function useAttachEvent(
  element: ShallowRef<stripeJs.StripeElement | null>,
  event: string,
  emit: (event: any, ...args: unknown[]) => void,
  shouldEmitElement = false,
) {
  watchEffect((onInvalidate) => {
    if (!element.value) {
      return
    }

    function cbWithEmit(...args: unknown[]) {
      if (shouldEmitElement) {
        emit(event, toRaw(element.value))
      }
      else {
        emit(event, ...args)
      }
    }

    ;(element.value as any).on(event, cbWithEmit)

    onInvalidate(() => {
      ;(element.value as any).off(event, cbWithEmit)
    })
  })
}
