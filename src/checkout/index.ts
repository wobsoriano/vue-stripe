import type { FunctionalComponent } from 'vue'
// `PaymentElementEmits` is defined in the root types, not the checkout types.
// This matches the existing import in v2. Do not move it to './types'.
import type { PaymentElementEmits } from '../types'
import type {
  BillingAddressElementEmits,
  BillingAddressElementProps,
  CheckoutFormEmits,
  CheckoutFormProps,
  ContactDetailsElementEmits,
  ContactDetailsElementProps,
  CurrencySelectorElementEmits,
  CurrencySelectorElementProps,
  ExpressCheckoutElementEmits,
  ExpressCheckoutElementProps,
  LinkSignupElementEmits,
  LinkSignupElementProps,
  PaymentElementProps,
  ShippingAddressElementEmits,
  ShippingAddressElementProps,
  TaxIdElementEmits,
  TaxIdElementProps,
  TermsElementEmits,
  TermsElementProps,
} from './types'
import { h } from 'vue'
import { createElementComponent } from '../components/createElementComponent'

export {
  useCheckout,
  useCheckoutElements,
  useCheckoutForm,
} from './components/CheckoutContext'
export type {
  StripeCheckoutElementsValue,
  StripeCheckoutFormValue,
  StripeCheckoutValue,
  StripeUseCheckoutElementsResult,
  StripeUseCheckoutFormResult,
  StripeUseCheckoutResult,
} from './components/CheckoutContext'
export { CheckoutElementsProvider } from './components/CheckoutElementsProvider'
export { CheckoutFormProvider } from './components/CheckoutFormProvider'
export * from './types'

/**
 * The Checkout form. Valid inside `<CheckoutFormProvider>`.
 *
 * Requires beta access:
 * Contact [Stripe support](https://support.stripe.com/) for more information.
 */
export const CheckoutForm = createElementComponent<CheckoutFormProps, CheckoutFormEmits>('paymentForm', 'CheckoutForm')

/**
 * Requires beta access:
 * Contact [Stripe support](https://support.stripe.com/) for more information.
 */
export const CurrencySelectorElement = createElementComponent<CurrencySelectorElementProps, CurrencySelectorElementEmits>('currencySelector')

export const PaymentElement = createElementComponent<PaymentElementProps, PaymentElementEmits>('payment')

export const ExpressCheckoutElement = createElementComponent<ExpressCheckoutElementProps, ExpressCheckoutElementEmits>('expressCheckout')

export const TaxIdElement = createElementComponent<TaxIdElementProps, TaxIdElementEmits>('taxId')

export const ContactDetailsElement = createElementComponent<ContactDetailsElementProps, ContactDetailsElementEmits>('contactDetails')

/**
 * Requires beta access:
 * Contact [Stripe support](https://support.stripe.com/) for more information.
 */
export const TermsElement = createElementComponent<TermsElementProps, TermsElementEmits>('terms')

/**
 * Requires beta access and must be used inside `CheckoutElementsProvider`.
 * It is not supported inside `CheckoutFormProvider`.
 * Contact [Stripe support](https://support.stripe.com/) for more information.
 */
export const LinkSignupElement = createElementComponent<LinkSignupElementProps, LinkSignupElementEmits>('linkSignup')

const AddressElementBase = createElementComponent('address')

export const BillingAddressElement: FunctionalComponent<BillingAddressElementProps, BillingAddressElementEmits> = (props) => {
  const { options, ...rest } = props

  return h(AddressElementBase, {
    ...rest,
    options: { ...options, mode: 'billing' } as any,
  })
}

export const ShippingAddressElement: FunctionalComponent<ShippingAddressElementProps, ShippingAddressElementEmits> = (props) => {
  const { options, ...rest } = props

  return h(AddressElementBase, {
    ...rest,
    options: { ...options, mode: 'shipping' } as any,
  })
}
