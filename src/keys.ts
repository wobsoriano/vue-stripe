import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { CheckoutContextValue, CheckoutSdkContextValue } from './components/CheckoutProvider'
import type { ElementsContextValue } from './components/Elements'
import type { EmbeddedCheckoutContextValue } from './components/EmbeddedCheckoutProvider'

export const ElementsKey = Symbol('elements') as InjectionKey<ElementsContextValue>
export const CheckoutSdkKey = Symbol('checkout sdk') as InjectionKey<CheckoutSdkContextValue>
export const CheckoutKey = Symbol('checkout') as InjectionKey<ComputedRef<CheckoutContextValue | null>>
export const EmbeddedCheckoutKey = Symbol('embedded checkout') as InjectionKey<Ref<EmbeddedCheckoutContextValue>>
