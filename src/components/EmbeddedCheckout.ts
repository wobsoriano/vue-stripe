import { defineComponent, h, shallowRef, watchEffect } from 'vue'
import { useEmbeddedCheckoutContext } from './EmbeddedCheckoutProvider'

interface EmbeddedCheckoutProps {
  /**
   * Passes through to the Embedded Checkout container.
   */
  id?: string

  /**
   * Passes through to the Embedded Checkout container.
   */
  class?: string
}

export const EmbeddedCheckout = defineComponent((props: EmbeddedCheckoutProps) => {
  const ctx = useEmbeddedCheckoutContext()
  const isMounted = shallowRef(false)
  const domNode = shallowRef<HTMLDivElement | null>(null)

  watchEffect((onInvalidate) => {
    if (!isMounted.value && ctx.value.embeddedCheckout && domNode.value !== null) {
      isMounted.value = true
      ctx.value.embeddedCheckout.mount(domNode.value)
    }

    onInvalidate(() => {
      ctx.value.embeddedCheckout?.unmount()
      isMounted.value = false
    })
  })

  return () => h('div', {
    id: props.id,
    class: props.class,
    ref: domNode,
  })
}, {
  inheritAttrs: false,
  props: ['id', 'class'],
})
