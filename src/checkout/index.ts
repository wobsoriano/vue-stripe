import type { FunctionalComponent } from 'vue'
import type { PaymentElementEmits } from '../types'
import type { BillingAddressElementEmits, BillingAddressElementProps, CurrencySelectorElementEmits, CurrencySelectorElementProps, ExpressCheckoutElementEmits, ExpressCheckoutElementProps, PaymentElementProps, ShippingAddressElementEmits, ShippingAddressElementProps, TaxIdElementEmits, TaxIdElementProps } from './types'
import { h } from 'vue'
import { createElementComponent } from '../components/createElementComponent'

export {
  CheckoutProvider,
  useCheckout,
} from './components/CheckoutProvider'

/**
 * Requires beta access:
 * Contact [Stripe support](https://support.stripe.com/) for more information.
 */
export const CurrencySelectorElement = createElementComponent<CurrencySelectorElementProps, CurrencySelectorElementEmits>('currencySelector')

export const PaymentElement = createElementComponent<PaymentElementProps, PaymentElementEmits>('payment')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const ExpressCheckoutElement = createElementComponent<ExpressCheckoutElementProps, ExpressCheckoutElementEmits>('expressCheckout')

export const TaxIdElement = createElementComponent<TaxIdElementProps, TaxIdElementEmits>('taxId')

const AddressElementBase = createElementComponent<TaxIdElementProps, TaxIdElementEmits>('address')

export const BillingAddressElement: FunctionalComponent<BillingAddressElementProps, BillingAddressElementEmits> = (props) => {
  const { options, ...rest } = props

  return h(AddressElementBase, {
    ...rest,
    options: {
      ...options,
      mode: 'billing',
    } as any,
  })
}

export const ShippingAddressElement: FunctionalComponent<ShippingAddressElementProps, ShippingAddressElementEmits> = (props) => {
  const { options, ...rest } = props

  return h(AddressElementBase, {
    ...rest,
    options: {
      ...options,
      mode: 'shipping',
    } as any,
  })
}
