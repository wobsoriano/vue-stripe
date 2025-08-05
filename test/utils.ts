import type { Component } from 'vue'
import { createApp, defineComponent, h } from 'vue'

interface Options {
  wrapper: Component
}

export function renderComposable<T>(composable: () => T, options: Options) {
  let result!: T
  const Comp = defineComponent({
    setup() {
      result = composable()

      return () => null
    },
  })

  const Provider = defineComponent({
    setup() {
      return () => h(options.wrapper, () => h(Comp))
    },
  })

  const { unmount } = mount(Provider)

  return {
    result,
    unmount
  }
}

type InstanceType<V> = V extends { new (...arg: any[]): infer X } ? X : never
type VM<V> = InstanceType<V> & { unmount: () => void }

function mount<V>(Comp: V) {
  const el = document.createElement('div')
  const app = createApp(Comp as any)
  const unmount = () => app.unmount()
  const comp = app.mount(el) as any as VM<V>
  comp.unmount = unmount
  return comp
}
