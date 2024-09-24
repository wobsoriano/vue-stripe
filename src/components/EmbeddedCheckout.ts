import { defineComponent, h, ref, watchEffect } from 'vue'
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
  const domNode = ref<HTMLDivElement | null>(null)

  watchEffect((onInvalidate) => {
    if (ctx.value.embeddedCheckout && domNode.value !== null) {
      ctx.value.embeddedCheckout.mount(domNode.value)
    }

    onInvalidate(() => {
      if (ctx.value.embeddedCheckout) {
        ctx.value.embeddedCheckout.unmount()
      }
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
