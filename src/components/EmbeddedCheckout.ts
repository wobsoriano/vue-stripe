import { defineComponent, h, shallowRef, watchEffect } from 'vue'
import { useEmbeddedCheckoutContext } from './EmbeddedCheckoutProvider'

export const EmbeddedCheckout = defineComponent({
  props: {
    id: {
      type: String,
      required: false,
    },
    class: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props) {
    const ctx = useEmbeddedCheckoutContext()
    const domNode = shallowRef<HTMLDivElement | null>(null)
    const isMounted = shallowRef(false)

    watchEffect((onInvalidate) => {
      if (!isMounted.value && ctx.value.embeddedCheckout && domNode.value !== null) {
        isMounted.value = true
        ctx.value.embeddedCheckout.mount(domNode.value)
      }

      onInvalidate(() => {
        const { embeddedCheckout } = ctx.value
        if (isMounted.value && embeddedCheckout) {
          try {
            embeddedCheckout.unmount()
            isMounted.value = false
          }
          catch {
            // Do nothing.
            // Parent effects are destroyed before child effects, so
            // in cases where both the EmbeddedCheckoutProvider and
            // the EmbeddedCheckout component are removed at the same
            // time, the embeddedCheckout instance will be destroyed,
            // which causes an error when calling unmount.
          }
        }
      })
    })

    return () => h('div', {
      id: props.id,
      class: props.class,
      ref: domNode,
    })
  },
})
