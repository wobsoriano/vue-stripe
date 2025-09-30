import type * as stripeJs from '@stripe/stripe-js'
import type { EmitsOptions, FunctionalComponent, ShallowRef } from 'vue'
import { defineComponent, h, onUnmounted, ref, shallowRef, toRaw, watch, watchEffect } from 'vue'
import { useElementsOrCheckoutSdkContextWithUseCase } from '../checkout/components/CheckoutProvider'

const capitalized = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

interface Props {
  id?: string
  class?: string
  options?: any
}

export function createElementComponent<ElementProps extends Props, ElementEmits extends EmitsOptions>(
  type: stripeJs.StripeElementType,
) {
  const displayName = `${capitalized(type)}Element`

  const Element = defineComponent<ElementProps, ElementEmits>((props, { attrs, emit }) => {
    const ctx = useElementsOrCheckoutSdkContextWithUseCase(`mounts <${displayName}>`)
    const elements = 'elements' in ctx ? ctx.elements : null
    const checkoutSdk = 'checkoutSdk' in ctx ? ctx.checkoutSdk : null
    const elementRef = shallowRef<stripeJs.StripeElement | null>(null)
    const domNode = ref<HTMLDivElement | null>(null)

    watchEffect(() => {
      if (elementRef.value === null && domNode.value !== null && (elements?.value || checkoutSdk?.value)) {
        let newElement: stripeJs.StripeElement | null = null
        const options = props.options || {}

        if (checkoutSdk?.value) {
          switch (type) {
            case 'payment':
              newElement = checkoutSdk.value.createPaymentElement(options)
              break
            case 'address':
              if ('mode' in options) {
                const { mode, ...restOptions } = options
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
                props.options as unknown as stripeJs.StripeCheckoutExpressCheckoutElementOptions,
              ) as stripeJs.StripeExpressCheckoutElement
              break
            case 'currencySelector':
              newElement = checkoutSdk.value.createCurrencySelectorElement()
              break
            case 'taxId':
              newElement = checkoutSdk.value.createTaxIdElement(options)
              break
            default:
              throw new Error(
                `Invalid Element type ${displayName}. You must use either the <PaymentElement />, <AddressElement options={{mode: 'shipping'}} />, <AddressElement options={{mode: 'billing'}} />, or <ExpressCheckoutElement />.`,
              )
          }
        }
        else if (elements?.value) {
          newElement = elements.value.create(type as any, options)
        }

        // Store element in state to facilitate event listener attachment
        elementRef.value = newElement

        if (newElement) {
          newElement.mount(domNode.value)
        }
      }
    })

    watch(() => props.options || {}, (options) => {
      if (elementRef.value && 'update' in elementRef.value) {
        elementRef.value.update(options)
      }
    }, { deep: true })

    // For every event where the merchant provides a callback, call element.on
    // with that callback. If the merchant ever changes the callback, removes
    // the old callback with element.off and then call element.on with the new one.
    useAttachEvent(elementRef, 'blur', emit, Boolean(attrs.onBlur))
    useAttachEvent(elementRef, 'focus', emit, Boolean(attrs.onFocus))
    useAttachEvent(elementRef, 'escape', emit, Boolean(attrs.onEscape))
    useAttachEvent(elementRef, 'click', emit, Boolean(attrs.onClick))
    useAttachEvent(elementRef, 'loaderror', emit, Boolean(attrs.onLoaderror))
    useAttachEvent(elementRef, 'loaderstart', emit, Boolean(attrs.onLoaderstart))
    useAttachEvent(elementRef, 'networkschange', emit, Boolean(attrs.onNetworkschange))
    useAttachEvent(elementRef, 'confirm', emit, Boolean(attrs.onConfirm))
    useAttachEvent(elementRef, 'cancel', emit, Boolean(attrs.onCancel))
    useAttachEvent(elementRef, 'shippingaddresschange', emit, Boolean(attrs.onShippingaddresschange))
    useAttachEvent(elementRef, 'shippingratechange', emit, Boolean(attrs.onShippingratechange))
    useAttachEvent(elementRef, 'savedpaymentmethodremove', emit, Boolean(attrs.onSavedPaymentMethodRemove))
    useAttachEvent(elementRef, 'savedpaymentmethodupdate', emit, Boolean(attrs.onSavedPaymentMethodUpdate))
    useAttachEvent(elementRef, 'change', emit, Boolean(attrs.onChange))

    const shouldEmitElement = type !== 'expressCheckout'
    useAttachEvent(elementRef, 'ready', emit, Boolean(attrs.onReady), shouldEmitElement)

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
      ref: domNode,
    })
  }, {
    props: ['id', 'class', 'options'],
    name: displayName,
    inheritAttrs: false,
  })

  /**
   * Stripe's elements.getElement() method requires the component to be a function
   * with an __elementType property. It performs this check:
   * `"function" == typeof component && component.__elementType`
   *
   * Since Vue's defineComponent() returns a constructor/class (not a plain function),
   * we wrap it in this function to satisfy Stripe's requirements while preserving
   * all Vue component functionality including reactivity and event emission.
   */
  const ElementWrapper: FunctionalComponent<ElementProps, ElementEmits> = (props) => {
    return h(Element, props as any)
  }

  // @ts-expect-error: Internal Stripe requirement
  ElementWrapper.__elementType = type

  return ElementWrapper
}

export function useAttachEvent(
  element: ShallowRef<stripeJs.StripeElement | null>,
  event: string,
  emit: (event: any, ...args: unknown[]) => void,
  // Whether to listen for the event
  isListeningForEvent: boolean,
  // Emit with the element as payload
  shouldEmitElement = false,
) {
  watchEffect((onInvalidate) => {
    if (!element.value || !isListeningForEvent) {
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
