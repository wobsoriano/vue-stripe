import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { CustomCheckoutContextValue, CustomCheckoutSdkContextValue } from './components/CustomCheckout'
import type { ElementsContextValue } from './components/Elements'
import type { EmbeddedCheckoutContextValue } from './components/EmbeddedCheckoutProvider'

export const ElementsKey = Symbol('elements') as InjectionKey<ElementsContextValue>
export const CustomCheckoutSdkKey = Symbol('custom checkout sdk') as InjectionKey<CustomCheckoutSdkContextValue>
export const CustomCheckoutKey = Symbol('custom checkout') as InjectionKey<ComputedRef<CustomCheckoutContextValue | null>>
export const EmbeddedCheckoutKey = Symbol('embedded checkout') as InjectionKey<Ref<EmbeddedCheckoutContextValue>>
