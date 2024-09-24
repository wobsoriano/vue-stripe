import type { StripeElement } from '@stripe/stripe-js'
import type { ShallowRef } from 'vue'
import { watchEffect } from 'vue'

export function useAttachEvent(
  element: ShallowRef<StripeElement | null>,
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
        emit(event, element.value)
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
