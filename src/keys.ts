import type { ComputedRef, InjectionKey } from 'vue'
import type { CustomCheckoutContextValue, CustomCheckoutSdkContextValue } from './components/CustomCheckout'
import type { ElementsContextValue } from './components/Elements'

export const ElementsKey = Symbol('elements') as InjectionKey<ElementsContextValue>
export const CustomCheckoutSdkKey = Symbol('custom checkout sdk') as InjectionKey<CustomCheckoutSdkContextValue>
export const CustomCheckoutKey = Symbol('custom checkout') as InjectionKey<ComputedRef<CustomCheckoutContextValue | null>>
